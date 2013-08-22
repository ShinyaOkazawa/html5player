json.array!(@votes) do |vote|
  json.extract! vote, :cnt, :content_id, :col_id
  json.url vote_url(vote, format: :json)
end
