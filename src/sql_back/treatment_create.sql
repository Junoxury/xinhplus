    -- 시술정보 테이블 생성
    CREATE TABLE treatments (
        id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        hospital_id bigint REFERENCES hospitals(id) ON DELETE CASCADE,
        title varchar(200) NOT NULL,
        summary text,
        city_id bigint REFERENCES cities(id),
        rating decimal(2,1) DEFAULT 0.0 
            CHECK (rating >= 0.0 AND rating <= 5.0),
        comment_count bigint DEFAULT 0,
        view_count bigint DEFAULT 0,
        like_count bigint DEFAULT 0,
        thumbnail_url varchar(200),
        detail_content text,
        is_advertised boolean DEFAULT false,
        is_recommended boolean DEFAULT false,
        is_discounted boolean DEFAULT false,
        price decimal(12,2),
        discount_price decimal(12,2),
        discount_rate integer,
        created_at timestamptz DEFAULT now(),
        updated_at timestamptz DEFAULT now()
    );

    -- 시술-카테고리 매핑 테이블
    CREATE TABLE treatment_categories (
        id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        treatment_id bigint REFERENCES treatments(id) ON DELETE CASCADE,
        depth2_category_id bigint REFERENCES categories(id),
        depth3_category_id bigint REFERENCES categories(id),
        created_at timestamptz DEFAULT now(),
        
        UNIQUE(treatment_id, depth2_category_id, depth3_category_id)
    );

    -- 시술정보 테이블 인덱스
    CREATE INDEX idx_treatments_hospital ON treatments(hospital_id);
    CREATE INDEX idx_treatments_city ON treatments(city_id);
    CREATE INDEX idx_treatments_rating ON treatments(rating DESC);
    CREATE INDEX idx_treatments_view_count ON treatments(view_count DESC);
    CREATE INDEX idx_treatments_like_count ON treatments(like_count DESC);
    CREATE INDEX idx_treatments_created_at ON treatments(created_at DESC);
    CREATE INDEX idx_treatments_price ON treatments(price);
    CREATE INDEX idx_treatments_is_advertised ON treatments(is_advertised);
    CREATE INDEX idx_treatments_is_recommended ON treatments(is_recommended);
    CREATE INDEX idx_treatments_is_discounted ON treatments(is_discounted);

    -- 시술-카테고리 매핑 테이블 인덱스
    CREATE INDEX idx_treatment_categories_treatment ON treatment_categories(treatment_id);
    CREATE INDEX idx_treatment_categories_depth2 ON treatment_categories(depth2_category_id);
    CREATE INDEX idx_treatment_categories_depth3 ON treatment_categories(depth3_category_id);

    
