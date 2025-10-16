import { Router } from 'express'
import { preferenceController } from '../controllers/preference.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

// All routes require authentication
router.use(authMiddleware)

// ==================== GET PREFERENCES ====================

router.get('/preferences', preferenceController.getAllPreferences)
router.get(
    '/preferences/categories',
    preferenceController.getCategoryPreferences
)
router.get('/preferences/vibes', preferenceController.getVibePreferences)

// ==================== UPDATE PREFERENCES ====================

router.post(
    '/preferences/categories',
    preferenceController.setCategoryPreference
)
router.post(
    '/preferences/categories/bulk',
    preferenceController.setBulkCategoryPreferences
)
router.post('/preferences/vibes', preferenceController.setVibePreference)

// ==================== BLOCK/UNBLOCK ====================

router.post('/preferences/block-category', preferenceController.blockCategory)
router.post(
    '/preferences/unblock-category',
    preferenceController.unblockCategory
)
router.post('/preferences/block-vibe', preferenceController.blockVibe)
router.post('/preferences/unblock-vibe', preferenceController.unblockVibe)

// ==================== FEED MIXER ====================

router.get('/feed/mixed', preferenceController.getMixedFeed)
router.get('/feed/default', preferenceController.getDefaultFeed)

export default router

