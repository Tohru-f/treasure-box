FROM ruby:3.4.10-slim-bookworm AS base
WORKDIR /app
# 推奨パッケージをインストールせず、ライブラリのインデックスリストは削除してイメージのスリム化
RUN apt-get update -qq && apt-get install -y --no-install-recommends libpq-dev && rm -rf /var/lib/apt/lists/*

# Gemfile類は先にコピーして、bundle installのキャッシュ用
COPY Gemfile Gemfile.lock ./


FROM base AS development

# 開発ツールのインストール(gcc, makeなど)
RUN apt-get update -qq && apt-get install -y --no-install-recommends build-essential git && rm -rf /var/lib/apt/lists/*

RUN bundle install

COPY . .

EXPOSE 3000
CMD ["bin/rails", "server", "-b", "0.0.0.0"]

FROM base AS builder

RUN ape-get update -qq && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists/*

# 開発とテストのgemは除外してインストールする
RUN bundle config set --local without 'development test' && bundle install

COPY . .

FROM ruby:3.4.10-slim-bookworm AS production

WORKDIR /app

RUN apt-get update -qq && apt-get install -y --no-install-recommends libpq-dev && rm -rf /var/lib/apt/lists/*

# Railsに本番環境として動作させる。development,testグループのGemをインストールから外す。ログをファイルではなく標準出力
ENV RAILS_ENV=production BUNDLE_WITHOUT="development:test" RAILS_LOG_TO_STDOUT="1"

# Gemのデータだけをコピーして、容量が重いコンパイラを省く
COPY --from=builder /usr/local/bundle /usr/local/bundle
# 本番環境にだけ必要なコード、Gem設定が適用されたソースコードを取得する
COPY --from=builder /app /app

EXPOSE 3000
CMD ["bin/rails", "server", "-b", "0.0.0.0"]