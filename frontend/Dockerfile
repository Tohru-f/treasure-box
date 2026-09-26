FROM node:24.21.0-bookworm-slim AS base
WORKDIR /app
# 設定ファイルだけキャッシュさせる。変更が無ければ初回以降のインストールが早くなる
COPY package*.json ./

FROM base AS development
# lockfileに従ってインストール。lockfileを更新せず、再現性重視
RUN npm ci
# ローカルからコンテナへソースコードをコピー
COPY . .
# Next.jsの開発サーバーポートを開放
EXPOSE 3000
# コンテナ起動時にNext.jsを立ち上げる
CMD ["npm", "run", "dev"]

FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# 本番環境ではbaseから引き継がず、ビルドステージから取得する
FROM node:24.21.0-bookworm-slim AS production
WORKDIR /app

# Next.jsとNode.jsを最高速度・最小リソースで動かす本番モードへ切り替え。レンダリング処理やメモリ使用を最小限に抑える
ENV NODE_ENV=production

# ビルドステージから必要な成果物だけを取得してイメージを軽くする
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# 開発環境用は省く
RUN npm ci --omit=dev

# Next.jsの開発サーバーポートを開放
EXPOSE 3000

CMD ["npm", "run", "start"]