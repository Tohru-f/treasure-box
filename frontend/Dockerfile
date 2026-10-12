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

# node server.jsが検知できるようにIPアドレスを指定
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Standalone出力された自己完結型ファイル群を全てコピー。コンテナ乗っ取り対策でファイルの権限を作成したユーザーにする
COPY --from=builder --chown=node:node /app/.next/standalone ./

# 動的アセット(CSS/JS/画像など)をstandalone内のパスへコピー。コンテナ乗っ取り対策でファイルの権限を作成したユーザーにする
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# 実行ユーザーをrootからnodeユーザーに変更
USER node

# Next.jsの開発サーバーポートを開放
EXPOSE 3000

# .next/standaloneをapp直下にコピーしているのでこのコマンドで実行
CMD ["node", "server.js"]