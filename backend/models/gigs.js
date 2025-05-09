const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming the 'User' model exists
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming the 'User' model exists and freelancer is also a user
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'], // You can adjust status based on your flow
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema);

module.exports = PurchaseRequest;
