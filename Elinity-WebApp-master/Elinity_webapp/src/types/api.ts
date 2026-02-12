// ============================================
// Authentication Types
// ============================================

export interface LoginRequest {
    email?: string;
    phone?: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    phone?: string;
    full_name?: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface RefreshRequest {
    refresh_token: string;
}

// ============================================
// User & Profile Types
// ============================================

export interface User {
    id: string;
    email: string;
    phone?: string;
    full_name?: string;
    created_at: string;
    updated_at: string;
    profile_pictures?: ProfilePicture[];
    personal_info?: PersonalInfo;
    big_five_traits?: BigFiveTraits;
    mbti_traits?: MBTITraits;
    psychology?: Psychology;
    interests_and_hobbies?: InterestsAndHobbies;
    values_beliefs_and_goals?: ValuesBeliefsAndGoals;
    favorites?: Favorites;
    relationship_preferences?: RelationshipPreferences;
    friendship_preferences?: FriendshipPreferences;
    collaboration_preferences?: CollaborationPreferences;
    personal_free_form?: PersonalFreeForm;
    intentions?: Intentions;
    aspiration_and_reflections?: AspirationAndReflections;
    ideal_characteristics?: IdealCharacteristics;
    lifestyle?: Lifestyle;
}

export interface PersonalInfo {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    age?: number;
    gender?: string;
    sexual_orientation?: string;
    location?: string;
    relationship_status?: string;
    education?: string;
    occupation?: string;
}

export interface BigFiveTraits {
    openness?: number;
    conscientiousness?: number;
    extraversion?: number;
    agreeableness?: number;
    neuroticism?: number;
}

export interface MBTITraits {
    introversion?: number;
    extraversion?: number;
    agreeableness?: number;
    neuroticism?: number;
}

export interface Psychology {
    communication_style?: string;
    conflict_resolution_style?: string;
    attachment_style?: string;
    emotional_intelligence?: number;
    cognitive_style?: string;
    stress_tolerance?: string;
}

export interface InterestsAndHobbies {
    interests?: string[];
    hobbies?: string[];
}

export interface ValuesBeliefsAndGoals {
    values?: string[];
    beliefs?: string;
    personal_goals?: string[];
    professional_goals?: string[];
    aspirations?: string[];
}

export interface Favorites {
    anecdotes?: string[];
    quotes?: string[];
    movies?: string[];
    music?: string[];
    art?: string[];
    books?: string[];
    poems?: string[];
    places?: string[];
}

export interface RelationshipPreferences {
    seeking?: string;
    looking_for?: string[];
    relationship_goals?: string;
    deal_breakers?: string[];
    red_flags?: string[];
    green_flags?: string[];
    what_i_offer?: string[];
    what_i_want?: string[];
}

export interface FriendshipPreferences {
    seeking?: string;
    goals?: string;
    ideal_traits?: string[];
    activities?: string[];
}

export interface CollaborationPreferences {
    seeking?: string;
    areas_of_expertise?: string[];
    achievements?: string[];
    ideal_collaborator_traits?: string[];
    goals?: string[];
}

export interface PersonalFreeForm {
    things_to_share?: string;
}

export interface Intentions {
    romantic?: string;
    social?: string;
    professional?: string;
}

export interface AspirationAndReflections {
    bucket_list?: string[];
    life_goals?: string[];
    greatest_regrets?: string[];
    greatest_fears?: string[];
}

export interface IdealCharacteristics {
    passionate?: number;
    adventurous?: number;
    supportive?: number;
    funny?: number;
    reliable?: number;
    open_minded?: number;
    innovative?: number;
    dedicated?: number;
    ethical?: number;
}

export interface Lifestyle {
    ideal_day?: string;
    ideal_week?: string;
    ideal_weekend?: string;
    lifestyle_rhythms?: string;
}

export interface ProfilePicture {
    id: string;
    url: string;
    is_primary: boolean;
    created_at: string;
}

// ============================================
// Dashboard Types
// ============================================

export interface DashboardStats {
    active_rituals?: number;
    relationship_status?: string;
    unread_messages?: number;
    total_matches?: number;
    journal_entries?: number;
    completed_quizzes?: number;
}

export interface RelationshipDashboard {
    status?: string;
    partner_id?: string;
    relationship_health?: number;
    shared_activities?: number;
    daily_card?: DailyCard;
}

export interface DailyCard {
    id: string;
    title: string;
    content: string;
    type: string;
    created_at: string;
}

// ============================================
// Chat Types
// ============================================

export interface Chat {
    id: string;
    type: 'direct' | 'group';
    name?: string;
    participants: string[];
    last_message?: Message;
    unread_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Message {
    id: string;
    chat_id: string;
    sender_id: string;
    content: string;
    type: 'text' | 'image' | 'voice' | 'video';
    created_at: string;
}

export interface Group {
    id: string;
    name: string;
    description?: string;
    avatar_url?: string;
    created_by: string;
    created_at: string;
}

// ============================================
// Journal Types
// ============================================

export interface Journal {
    id: string;
    user_id: string;
    title?: string;
    content: string;
    mood?: string;
    tags?: string[];
    created_at: string;
    updated_at: string;
}

export interface JournalCreate {
    title?: string;
    content: string;
    mood?: string;
    tags?: string[];
}

// ============================================
// Recommendations Types
// ============================================

export interface RecommendedUser {
    tenant: User;
    score: number;
    ai_insight: string;
    connection_status?: string;
    connection_id?: string;
}

// ============================================
// Games Types
// ============================================

export interface Game {
    id: string;
    name: string;
    slug: string;
    description: string;
    category: string;
    min_players: number;
    max_players: number;
    duration_minutes: number;
    tier: 'free' | 'premium';
    thumbnail_url?: string;
}

export interface GameSession {
    id: string;
    game_slug: string;
    host_id: string;
    players: GamePlayer[];
    status: 'waiting' | 'ready' | 'playing' | 'finished';
    state: any;
    created_at: string;
}

export interface GamePlayer {
    user_id: string;
    username: string;
    is_ready: boolean;
    score?: number;
}

// ============================================
// Tools Types
// ============================================

export interface Ritual {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    frequency: string;
    completed_count: number;
    streak: number;
    created_at: string;
}

export interface Moodboard {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    images: string[];
    created_at: string;
}

export interface Quiz {
    id: string;
    title: string;
    description?: string;
    questions: QuizQuestion[];
    created_at: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    text?: string;
    type: 'multiple_choice' | 'scale' | 'text';
    options?: string[];
    min?: number;
    max?: number;
    min_label?: string;
    max_label?: string;
    correct_answer?: number | string;
}

export interface QuestionCard {
    text: string;
    category?: string;
    color?: string;
    tags?: string[];
    difficulty_level?: 'easy' | 'medium' | 'hard';
}

export interface QuestionCardAnswer {
    id: string;
    card_content: string;
    answer: string;
    created_at: string;
    tenant_id: string;
}

// ============================================
// Events Types
// ============================================

export interface Event {
    id: string;
    title: string;
    description?: string;
    host_id: string;
    start_time: string;
    end_time?: string;
    location?: string;
    attendees: string[];
    created_at: string;
}

// ============================================
// Social Feed Types
// ============================================

export interface UserPostInfo {
    id: string;
    full_name: string;
    avatar?: string;
}

export interface SocialComment {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    user?: UserPostInfo;
}

export interface SocialPost {
    id: string;
    author_id: string;
    content: string;
    media_urls: string[];
    likes: string[];
    comments: SocialComment[];
    created_at: string;
    user?: UserPostInfo;
}

// ============================================
// Lifebook Types
// ============================================

export interface Lifebook {
    id: string;
    user_id: string;
    category: string;
    title: string;
    created_at: string;
}

export interface LifebookEntry {
    id: string;
    lifebook_id: string;
    content: string;
    media_urls?: string[];
    created_at: string;
}

// ============================================
// Notification Types
// ============================================

export interface Notification {
    id: string;
    user_id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

// ============================================
// Subscription Types
// ============================================

export interface Subscription {
    id: string;
    user_id: string;
    tier: 'free' | 'basic' | 'premium' | 'elite';
    status: 'active' | 'cancelled' | 'expired';
    expires_at?: string;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    tier: string;
    price: number;
    features: string[];
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: any;
}
