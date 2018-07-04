var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;
var loginRecordSchema = new mongoose.Schema(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    login_date: { type: Date, default: Date.now },
    in_time:{ type: Date },
    out_time: { type: Date },
    task: String
  },
  {
    timestamps: true  // auto adds created_At & updated_At fields
  }
);
mongoose.model('LoginRecord', loginRecordSchema);