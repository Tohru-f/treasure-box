export default async function Home() {
  const res = await fetch('http://backend:3000/api/v1/health', {
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Fetch error:', errorText);
    throw new Error(`Failed to fetch API: ${res.status}`);
  }

  const data = await res.json(); // JSONを受け取って、JavaScriptのオブジェクトを生成

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>フロントエンドとバックエンドの疎通確認</h1>
      <p>バックエンドからのレスポンス</p>
      <p>ステータス：{data.status}</p>
      <p>メッセージ：{data.message}</p>
    </main>
  );
}
