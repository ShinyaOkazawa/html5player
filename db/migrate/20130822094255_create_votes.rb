class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.integer :cnt
      t.integer :content_id
      t.integer :col_id

      t.timestamps
    end
  end
end
