class WelcomesController < ApplicationController
  
  # GET /welcomes
  # GET /welcomes.json
  def index
    @votes = Vote.where(content_id: 1)
  end

end
