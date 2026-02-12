export interface Message {
  id: string
  fromId: string
  toId: string
  text: string
  timestamp: string
}

export interface RelationshipMetrics {
  healthScore: number // 0-100
  lastConflict?: string
  positiveInteractions: number
  sharedActivities: string[]
}

export interface RelationshipHistory {
  id: string
  date: string
  note: string
}

export interface Person {
  id: string
  name: string
  avatar?: string
  relation: string
  bio?: string
  metrics?: RelationshipMetrics
  history?: RelationshipHistory[]
}
// (Removed alternate/duplicate definitions to keep a single consistent API surface.)
