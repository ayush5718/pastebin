import { notFound } from 'next/navigation';
import { getPaste, incrementViewCount } from '@/lib/db';
import { isPasteAvailable } from '@/lib/paste';
import { getCurrentTime } from '@/lib/utils';
import { headers } from 'next/headers';

export default async function PastePage({ params }: { params: { id: string } }) {
  const paste = await getPaste(params.id);

  if (!paste) {
    notFound();
  }

  const testMode = process.env.TEST_MODE === '1';
  const headersList = headers();
  const testHeader = headersList.get('x-test-now-ms') || undefined;
  const currentTime = getCurrentTime(testMode, testHeader);

  if (!isPasteAvailable(paste, testMode, testHeader)) {
    notFound();
  }

  const updatedPaste = await incrementViewCount(params.id, currentTime);
  if (!updatedPaste) {
    notFound();
  }

  if (!isPasteAvailable(updatedPaste, testMode, testHeader)) {
    notFound();
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <pre style={{ 
        whiteSpace: 'pre-wrap', 
        wordWrap: 'break-word',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '4px',
        border: '1px solid #ddd'
      }}>
        {updatedPaste.content}
      </pre>
    </div>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Paste ${params.id}`,
  };
}
