class Api::V1::HealthController < ApplicationController
  def index
    render json: { status: "ok", message: "フロント及びバックエンドの疎通成功！" }
  end
end
