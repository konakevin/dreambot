/**
 * FaeBot fae-court path (2026-06-10, transplanted from DragonBot). Ethereal
 * high-fae / elven-court / enchanted-glade scene — gossamer beauty, moonlight,
 * magic. Self-contained axes (FaeBot has no shared universal pools). MVP-25.
 */
module.exports = {
  archetype: 'FAEBOT_FAE_COURT',
  pools: {
    fae_subject: 'FAEBOT_FAE_COURT_SUBJECT',
    enchanted_setting: 'FAEBOT_FAE_COURT_SETTING',
    ethereal_detail: 'FAEBOT_FAE_COURT_DETAIL',
    surprise: 'FAEBOT_FAE_COURT_SURPRISE',
    fae_lighting: 'FAEBOT_FAE_COURT_LIGHTING',
    drama: 'FAEBOT_FAE_COURT_DRAMA', // 40% gated conditional
  },
};
