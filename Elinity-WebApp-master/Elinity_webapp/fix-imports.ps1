# Fix all type imports in API files
$files = @(
    @{path="events.ts"; old="import { Event } from '../types/api';"; new="import type { Event } from '../types/api';"},
    @{path="games.ts"; old="import { Game, GameSession } from '../types/api';"; new="import type { Game, GameSession } from '../types/api';"},
    @{path="journal.ts"; old="import { Journal, JournalCreate } from '../types/api';"; new="import type { Journal, JournalCreate } from '../types/api';"},
    @{path="lifebook.ts"; old="import { Lifebook, LifebookEntry } from '../types/api';"; new="import type { Lifebook, LifebookEntry } from '../types/api';"},
    @{path="notifications.ts"; old="import { Notification } from '../types/api';"; new="import type { Notification } from '../types/api';"},
    @{path="recommendations.ts"; old="import { RecommendedUser } from '../types/api';"; new="import type { RecommendedUser } from '../types/api';"},
    @{path="social.ts"; old="import { SocialPost } from '../types/api';"; new="import type { SocialPost } from '../types/api';"},
    @{path="tools.ts"; old="import { Ritual, Moodboard, Quiz, QuestionCard } from '../types/api';"; new="import type { Ritual, Moodboard, Quiz, QuestionCard } from '../types/api';"}
)

$apiDir = "c:\Users\nabhi\Downloads\python_elinity-main2\elinity-backend-github\Elinity-WebApp-master\Elinity_webapp\src\api"

foreach ($file in $files) {
    $filePath = Join-Path $apiDir $file.path
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $content = $content.Replace($file.old, $file.new)
        Set-Content $filePath $content -NoNewline
        Write-Host "Fixed: $($file.path)"
    }
}

Write-Host "All type imports fixed!"
