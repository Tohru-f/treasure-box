export default async function Home() {
  const baseUrl = process.env.API_BASE_URL;
  const res = await fetch(`${baseUrl}/health`, {
    cache: 'no-store',
  });

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
