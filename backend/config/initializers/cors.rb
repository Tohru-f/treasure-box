# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 環境変数から値を取得、配列化、不要なスペースを削除。環境変数が未設定であればローカルの値を使用
    origins ENV.fetch("FRONTEND_ORIGIN", "http://localhost:8000").split(",").map(&:strip)

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true # Cookieなどの利用時に必要
  end
end
