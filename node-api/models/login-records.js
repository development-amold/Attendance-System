var mongoose = require( 'mongoose' );
var loginRecord = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    login_date: { type: Date, default: Date.now },
    in_time:{ type: Date },
    out_time: { type: Date },
    task:{ type: String }
  },
  {
    timestamps: true  // auto adds created_At & updated_at fields
  }
);
mongoose.model('LoginRecord', loginRecord);