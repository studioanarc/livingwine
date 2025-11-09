-- Natural Wine Tracking App Database Schema
-- Database: PostgreSQL 14+
-- Design for "Cloudy" app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geolocation features

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    location VARCHAR(100),
    location_coordinates GEOGRAPHY(POINT, 4326),

    -- User settings
    is_private BOOLEAN DEFAULT false,
    email_verified BOOLEAN DEFAULT false,

    -- OAuth support
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),

    -- Reputation & credibility
    credibility_score INTEGER DEFAULT 100,
    user_level VARCHAR(20) DEFAULT 'explorer', -- explorer, enthusiast, advocate, steward

    -- Stats
    total_checkins INTEGER DEFAULT 0,
    total_unique_wines INTEGER DEFAULT 0,
    total_contributions INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP -- Soft delete
);

-- OAuth unique constraint
CREATE UNIQUE INDEX idx_users_oauth ON users(oauth_provider, oauth_id) WHERE oauth_provider IS NOT NULL AND oauth_id IS NOT NULL;

CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    -- Taste preferences (learned from check-ins)
    preferred_styles JSONB DEFAULT '[]', -- ["orange", "pet-nat", "light-red"]
    preferred_regions JSONB DEFAULT '[]', -- ["jura", "loire", "piedmont"]
    preferred_grapes JSONB DEFAULT '[]', -- ["chenin-blanc", "gamay"]

    -- Flavor profile preferences
    flavor_preferences JSONB DEFAULT '{}', -- {"funky": 0.8, "clean": 0.5, "oxidative": 0.3}

    -- Privacy settings
    show_location BOOLEAN DEFAULT true,
    show_price BOOLEAN DEFAULT true,
    allow_friend_requests BOOLEAN DEFAULT true,

    -- Notification settings
    notify_friend_checkins BOOLEAN DEFAULT true,
    notify_comments BOOLEAN DEFAULT true,
    notify_mentions BOOLEAN DEFAULT true,
    notify_producer_responses BOOLEAN DEFAULT false,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- SOCIAL CONNECTIONS
-- ============================================

CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    UNIQUE(user_id, friend_id),
    CHECK (user_id != friend_id)
);

CREATE TABLE user_blocks (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    blocked_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, blocked_user_id),
    CHECK (user_id != blocked_user_id)
);

-- ============================================
-- PRODUCERS (DOMAINES/WINERIES)
-- ============================================

CREATE TABLE producers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL, -- URL-friendly name

    -- Location
    country VARCHAR(100),
    region VARCHAR(100),
    sub_region VARCHAR(100),
    address TEXT,
    coordinates GEOGRAPHY(POINT, 4326),

    -- Profile
    description TEXT,
    philosophy TEXT, -- Their natural wine philosophy
    year_founded INTEGER,
    winemaker_name VARCHAR(100),

    -- Contact
    website VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(50),
    instagram VARCHAR(100),

    -- Verification status
    is_claimed BOOLEAN DEFAULT false, -- Has producer claimed this profile?
    claimed_by_user_id UUID REFERENCES users(id),
    claimed_at TIMESTAMP,

    -- Certifications
    certifications JSONB DEFAULT '[]', -- ["organic-eu", "demeter", "biodynamic"]
    certification_documents JSONB DEFAULT '[]', -- URLs to uploaded docs

    -- Stats
    total_wines INTEGER DEFAULT 0,
    total_checkins INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    community_verifications INTEGER DEFAULT 0,

    -- Images
    logo_url VARCHAR(500),
    cover_photo_url VARCHAR(500),
    photo_urls JSONB DEFAULT '[]',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE producer_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producer_id UUID REFERENCES producers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    verification_type VARCHAR(50), -- visited_domaine, confirmed_info, local_expert
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(producer_id, user_id, verification_type)
);

-- ============================================
-- WINES
-- ============================================

CREATE TABLE wines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producer_id UUID REFERENCES producers(id) ON DELETE CASCADE,

    -- Basic info
    name VARCHAR(200) NOT NULL,
    vintage INTEGER, -- NULL for NV (non-vintage)
    slug VARCHAR(250) UNIQUE NOT NULL,

    -- Classification
    wine_type VARCHAR(50), -- red, white, rose, orange, sparkling, pet-nat
    grape_varietals JSONB DEFAULT '[]', -- ["gamay", "pinot-noir"]
    region VARCHAR(100),
    appellation VARCHAR(100),
    seriousness_level INTEGER CHECK (seriousness_level >= 1 AND seriousness_level <= 5),
    food_pairing_style VARCHAR(20), -- solo, companion, versatile

    -- Production details
    alcohol_percentage DECIMAL(4,2),
    production_volume INTEGER, -- Number of bottles

    -- ==== VINEYARD DETAILS ====
    vineyard_details JSONB DEFAULT '{
        "farming_method": null,
        "certifications": [],
        "soil_type": null,
        "vineyard_age": null,
        "yield": null,
        "harvest_method": null,
        "harvest_date": null,
        "same_day_processing": null,
        "cooled_transport": null,
        "hand_sorted": null
    }',

    -- ==== CELLAR DETAILS ====
    cellar_details JSONB DEFAULT '{
        "fermentation": {
            "yeast_type": null,
            "vessel_type": null,
            "temperature_control": null,
            "duration_days": null,
            "maceration_days": null
        },
        "pressing": {
            "method": null,
            "whole_cluster": null,
            "batch_size": null
        },
        "aging": {
            "vessel_type": null,
            "duration_months": null,
            "new_oak_percentage": null,
            "lees_contact": null
        },
        "interventions": {
            "sulfites_added": null,
            "sulfites_ppm": null,
            "filtration": null,
            "fining": null,
            "additions": [],
            "ph_adjustments": null
        }
    }',

    -- ==== DISTRIBUTION DETAILS ====
    distribution_details JSONB DEFAULT '{
        "bottling": {
            "estate_bottled": null,
            "bottling_date": null,
            "closure_type": null
        },
        "distribution": {
            "production_scale": null,
            "importers": [],
            "temp_controlled_storage": null
        }
    }',

    -- Openness/transparency rating
    openness_score JSONB DEFAULT '{
        "completeness": 0,
        "community_verified": false,
        "producer_certified": false,
        "verified_count": 0
    }',

    -- Stats
    total_checkins INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,

    -- Images
    label_image_url VARCHAR(500),
    bottle_image_url VARCHAR(500),
    additional_images JSONB DEFAULT '[]',

    -- Metadata
    created_by_user_id UUID REFERENCES users(id),
    last_updated_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Wine availability and pricing
CREATE TABLE wine_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE, -- See below

    available BOOLEAN DEFAULT true,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    in_stock BOOLEAN DEFAULT true,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- VENUES (Wine Bars, Shops, Restaurants)
-- ============================================

CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,

    -- Type
    venue_type VARCHAR(50), -- wine_bar, wine_shop, restaurant, natural_wine_bar
    natural_wine_focus BOOLEAN DEFAULT false,

    -- Location
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    coordinates GEOGRAPHY(POINT, 4326),

    -- Contact
    phone VARCHAR(50),
    website VARCHAR(500),
    instagram VARCHAR(100),

    -- Details
    description TEXT,
    hours JSONB, -- {"monday": "12:00-22:00", ...}
    price_range VARCHAR(10), -- $, $$, $$$

    -- Images
    photos JSONB DEFAULT '[]',

    -- Stats
    total_checkins INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,

    created_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ============================================
-- VENUE DATA SOURCES TRACKING
-- ============================================

CREATE TABLE venue_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,

    -- Data source information
    source_type VARCHAR(50) NOT NULL, -- user_added, web_scrape, ocr_label, manual
    source_url TEXT,
    verified BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_venue_sources_venue ON venue_sources(venue_id);
CREATE INDEX idx_venue_sources_type ON venue_sources(source_type);

-- ============================================
-- CHECK-INS
-- ============================================

CREATE TABLE checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,

    -- Rating and review
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    tasting_notes TEXT,

    -- Flavor profile (user's perception)
    flavor_profile JSONB DEFAULT '{
        "funky": 0,
        "clean": 0,
        "oxidative": 0,
        "reductive": 0,
        "savory": 0,
        "mineral": 0,
        "floral": 0,
        "earthy": 0,
        "citrus": 0
    }',

    -- Mouthfeel
    mouthfeel JSONB DEFAULT '{
        "tannin": 0,
        "acidity": 0,
        "body": 0,
        "texture": null
    }',

    -- Context tags
    context_tags JSONB DEFAULT '[]', -- ["sunny_afternoon", "pizza_wine", "dinner_party"]
    food_pairings TEXT, -- What they ate with it

    -- Purchase details
    where_purchased VARCHAR(200),
    price_paid DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',

    -- Additional details
    serving_temperature VARCHAR(50), -- chilled, cellar_temp, room_temp
    vintage_condition VARCHAR(50), -- fresh, mature, past_peak

    -- Media
    photo_urls JSONB DEFAULT '[]',

    -- Social
    is_public BOOLEAN DEFAULT true,
    allow_comments BOOLEAN DEFAULT true,

    -- Location (where they drank it)
    location_name VARCHAR(200),
    location_coordinates GEOGRAPHY(POINT, 4326),

    -- Stats
    toast_count INTEGER DEFAULT 0, -- Like count
    comment_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_checkins_user ON checkins(user_id);
CREATE INDEX idx_checkins_wine ON checkins(wine_id);
CREATE INDEX idx_checkins_created ON checkins(created_at DESC);

-- ============================================
-- SOCIAL INTERACTIONS
-- ============================================

CREATE TABLE toasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    checkin_id UUID REFERENCES checkins(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, checkin_id)
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    checkin_id UUID REFERENCES checkins(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For replies

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ============================================
-- LISTS & COLLECTIONS
-- ============================================

CREATE TABLE lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    description TEXT,
    list_type VARCHAR(50), -- wishlist, favorites, collection, custom

    is_public BOOLEAN DEFAULT true,
    is_collaborative BOOLEAN DEFAULT false,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
    wine_id UUID REFERENCES wines(id) ON DELETE CASCADE,

    notes TEXT,
    position INTEGER, -- For ordering

    added_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(list_id, wine_id)
);

-- ============================================
-- ACHIEVEMENTS & GAMIFICATION
-- ============================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),

    achievement_type VARCHAR(50), -- style_explorer, regional_explorer, method_explorer, contributor

    -- Criteria (flexible JSONB for different types)
    criteria JSONB, -- {"wine_type": "orange", "count": 5}

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,

    progress INTEGER DEFAULT 0, -- Current progress
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- ============================================
-- COMMUNITY CONTRIBUTIONS
-- ============================================

CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    contribution_type VARCHAR(50), -- wine_creation, producer_creation, info_edit, verification, photo_upload

    -- Polymorphic reference
    target_type VARCHAR(50), -- wine, producer, venue
    target_id UUID,

    -- Edit details
    field_name VARCHAR(100), -- Which field was edited
    old_value TEXT,
    new_value TEXT,

    -- Status
    status VARCHAR(20) DEFAULT 'approved', -- pending, approved, rejected, disputed
    reviewed_by_user_id UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,

    -- Community validation
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contribution_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contribution_id UUID REFERENCES contributions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    vote_type VARCHAR(10), -- upvote, downvote

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(contribution_id, user_id)
);

-- ============================================
-- EVENTS & TASTINGS
-- ============================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    name VARCHAR(200) NOT NULL,
    description TEXT,
    event_type VARCHAR(50), -- tasting, wine_fair, domaine_visit, meetup

    -- Organizer
    organizer_user_id UUID REFERENCES users(id),
    organizer_producer_id UUID REFERENCES producers(id),
    organizer_venue_id UUID REFERENCES venues(id),

    -- Location & time
    venue_id UUID REFERENCES venues(id),
    location_name VARCHAR(200),
    location_coordinates GEOGRAPHY(POINT, 4326),

    start_time TIMESTAMP,
    end_time TIMESTAMP,

    -- Details
    is_public BOOLEAN DEFAULT true,
    max_attendees INTEGER,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',

    -- Registration
    requires_registration BOOLEAN DEFAULT false,
    registration_url VARCHAR(500),

    -- Images
    cover_photo_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    status VARCHAR(20) DEFAULT 'going', -- going, interested, not_going

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- ============================================
-- DIRECT MESSAGES
-- ============================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_participants (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_read_at TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,

    content TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    notification_type VARCHAR(50), -- friend_request, comment, toast, mention, producer_response

    -- Polymorphic reference to source
    source_type VARCHAR(50), -- checkin, comment, user, producer
    source_id UUID,

    -- Actor who triggered notification
    actor_id UUID REFERENCES users(id),

    content TEXT,

    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- ============================================
-- ACTIVITY FEED
-- ============================================

CREATE TABLE feed_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Who can see this

    activity_type VARCHAR(50), -- checkin, friend_added, achievement_unlocked

    -- Polymorphic reference
    target_type VARCHAR(50),
    target_id UUID,

    actor_id UUID REFERENCES users(id), -- Who did the action

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feed_user_created ON feed_items(user_id, created_at DESC);

-- ============================================
-- SEARCH & INDEXING
-- ============================================

-- Full-text search indexes
CREATE INDEX idx_wines_search ON wines USING gin(to_tsvector('english', name || ' ' || COALESCE(grape_varietals::text, '')));
CREATE INDEX idx_producers_search ON producers USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_venues_search ON venues USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Geospatial indexes
CREATE INDEX idx_producers_location ON producers USING GIST(coordinates);
CREATE INDEX idx_venues_location ON venues USING GIST(coordinates);
CREATE INDEX idx_checkins_location ON checkins USING GIST(location_coordinates);

-- ============================================
-- MAP CLUSTERING MATERIALIZED VIEW
-- ============================================

-- Materialized view for map clustering combining producers and venues
CREATE MATERIALIZED VIEW map_cluster_points AS
SELECT
    id,
    name,
    'producer' AS entity_type,
    coordinates,
    country,
    region,
    NULL::VARCHAR(50) AS venue_type,
    logo_url AS image_url,
    website,
    NULL::VARCHAR(100) AS instagram_handle,
    created_at
FROM producers
WHERE deleted_at IS NULL AND coordinates IS NOT NULL

UNION ALL

SELECT
    id,
    name,
    'venue' AS entity_type,
    coordinates,
    country,
    city AS region,
    venue_type,
    (photos->0)::VARCHAR(500) AS image_url,
    website,
    instagram AS instagram_handle,
    created_at
FROM venues
WHERE deleted_at IS NULL AND coordinates IS NOT NULL;

-- Index on the materialized view for spatial queries
CREATE INDEX idx_map_cluster_points_coordinates ON map_cluster_points USING GIST(coordinates);
CREATE INDEX idx_map_cluster_points_entity_type ON map_cluster_points(entity_type);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER producers_updated_at BEFORE UPDATE ON producers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER wines_updated_at BEFORE UPDATE ON wines
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER checkins_updated_at BEFORE UPDATE ON checkins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER venues_updated_at BEFORE UPDATE ON venues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update counters
CREATE OR REPLACE FUNCTION update_checkin_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update user stats
        UPDATE users SET
            total_checkins = total_checkins + 1
        WHERE id = NEW.user_id;

        -- Update wine stats
        UPDATE wines SET
            total_checkins = total_checkins + 1
        WHERE id = NEW.wine_id;

        -- Update producer stats
        UPDATE producers SET
            total_checkins = total_checkins + 1
        WHERE id = (SELECT producer_id FROM wines WHERE id = NEW.wine_id);

        -- Update venue stats
        IF NEW.venue_id IS NOT NULL THEN
            UPDATE venues SET
                total_checkins = total_checkins + 1
            WHERE id = NEW.venue_id;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER checkin_counts AFTER INSERT ON checkins
    FOR EACH ROW EXECUTE FUNCTION update_checkin_counts();

-- Update average ratings
CREATE OR REPLACE FUNCTION update_wine_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE wines SET
        average_rating = (
            SELECT AVG(rating)
            FROM checkins
            WHERE wine_id = NEW.wine_id AND rating IS NOT NULL
        )
    WHERE id = NEW.wine_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wine_rating_update AFTER INSERT OR UPDATE ON checkins
    FOR EACH ROW EXECUTE FUNCTION update_wine_rating();

-- ============================================
-- SAMPLE DATA SEED (Optional)
-- ============================================

-- Insert sample achievements
INSERT INTO achievements (name, slug, description, achievement_type, criteria) VALUES
('Orange Wine Explorer', 'orange-wine-explorer', 'Tried 5 skin-contact white wines', 'style_explorer', '{"wine_type": "orange", "count": 5}'),
('Pét-Nat Pioneer', 'pet-nat-pioneer', 'Tried 5 natural sparkling wines', 'style_explorer', '{"wine_type": "pet-nat", "count": 5}'),
('Jura Journey', 'jura-journey', 'Tried 10 wines from Jura region', 'regional_explorer', '{"region": "jura", "count": 10}'),
('Loire Lover', 'loire-lover', 'Tried 10 wines from Loire Valley', 'regional_explorer', '{"region": "loire", "count": 10}'),
('Community Contributor', 'community-contributor', 'Verified 10 producer details', 'contributor', '{"contribution_type": "verification", "count": 10}'),
('Domaine Supporter', 'domaine-supporter', 'Tried 5 wines from the same producer', 'producer_explorer', '{"same_producer": true, "count": 5}');

-- Comments
COMMENT ON TABLE users IS 'Core user accounts and profiles';
COMMENT ON TABLE wines IS 'Wine catalog with full production transparency details';
COMMENT ON TABLE producers IS 'Natural wine producers/domaines';
COMMENT ON TABLE checkins IS 'User wine check-ins with ratings and tasting notes';
COMMENT ON TABLE contributions IS 'Community contributions and edits for validation';
COMMENT ON COLUMN wines.openness_score IS 'Transparency rating based on information completeness and verification';
COMMENT ON COLUMN users.credibility_score IS 'User reputation score based on contribution accuracy';
