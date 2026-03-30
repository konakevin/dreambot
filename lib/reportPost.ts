import { showAlert } from '@/components/CustomAlert';
import { supabase } from '@/lib/supabase';

export function reportPost(uploadId: string, reporterId: string) {
  showAlert('Report Post', 'Why are you reporting this?', [
    { text: 'Spam', onPress: () => submitReport(uploadId, reporterId, 'spam') },
    { text: 'Inappropriate', onPress: () => submitReport(uploadId, reporterId, 'inappropriate') },
    { text: 'Harassment', onPress: () => submitReport(uploadId, reporterId, 'harassment') },
    { text: 'Cancel', style: 'cancel' },
  ]);
}

async function submitReport(uploadId: string, reporterId: string, reason: string) {
  await supabase.from('reports').insert({
    reporter_id: reporterId,
    upload_id: uploadId,
    reason,
  });
  showAlert('Reported', 'Thanks for letting us know.');
}
