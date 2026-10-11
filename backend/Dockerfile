FROM ruby:3.4.10-slim-bookworm AS base
WORKDIR /myapp
# 推奨パッケージをインストールせず、ライブラリのインデックスリストは削除してイメージのスリム化
RUN apt-get update -qq && apt-get install -y --no-install-recommends libpq-dev tzdata && rm -rf /var/lib/apt/lists /var/cache/apt/archives

ENV TZ=Asia/Tokyo

# Gemfile類は先にコピーして、bundle installのキャッシュ用
COPY Gemfile Gemfile.lock ./


FROM base AS development

# 開発ツールのインストール(gcc, makeなど)
RUN apt-get update -qq && apt-get install -y --no-install-recommends build-essential git && rm -rf /var/lib/apt/lists /var/cache/apt/archives

RUN bundle install

COPY . .

EXPOSE 3000
CMD ["bin/rails", "server", "-b", "0.0.0.0"]

FROM base AS builder

RUN apt-get update -qq && apt-get install -y --no-install-recommends build-essential && rm -rf /var/lib/apt/lists /var/cache/apt/archives

# 開発とテストのgemは除外してインストールする
RUN bundle config set --local without 'development test' && bundle install

COPY . .

FROM ruby:3.4.10-slim-bookworm AS production

WORKDIR /myapp

RUN apt-get update -qq && apt-get install -y --no-install-recommends libpq-dev tzdata && rm -rf /var/lib/apt/lists /var/cache/apt/archives

ENV TZ=Asia/Tokyo

# Railsに本番環境として動作させる。development,testグループのGemをインストールから外す。ログをファイルではなく標準出力
ENV RAILS_ENV=production BUNDLE_WITHOUT="development:test" RAILS_LOG_TO_STDOUT="1"

# コピーするファイルの権限者となるユーザーとグループを作成する。グループはシステムが使うグループ。Gemのロード・起動時のエラー対策でホームディレクトリ作成
RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash

# Gemのデータだけをコピーして、容量が重いコンパイラを省く。コンテナ乗っ取り対策でファイルの権限を作成したユーザーにする
COPY --from=builder --chown=rails:rails /usr/local/bundle /usr/local/bundle
# 本番環境にだけ必要なコード、Gem設定が適用されたソースコードを取得する
COPY --from=builder --chown=rails:rails /myapp /myapp

# 実行ユーザーをrootからrailsユーザーに変更
USER rails

EXPOSE 3000
CMD ["bin/rails", "server", "-b", "0.0.0.0"]