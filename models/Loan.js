const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const LoanApplicationSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    spaceRent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpaceRent",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    personalID: {
      type: {
        type: String,
        enum: ["Passport", "Voter ID", "Driver License", "NIN"],
        required: true,
      },
      idNumber: {
        type: String,
        required: true,
      },
    },
    proofOfResidence: {
      houseAddress: {
        type: String,
      },
      utilityBill: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    },
    landlordOrAgent: {
      name: {
        type: String,
        required: true,
      },
      livesInSameProperty: {
        type: Boolean,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      duration: {
        type: String,
        // required: true,
      },
      propertyType: {
        type: String,
        enum: ["Residential", "Commercial"],
        required: true,
      },
      accountNumber: {
        type: String,
        required: true,
      },
      bankName: {
        type: String,
        required: true,
      },
    },
    occupation: {
      status: {
        type: String,
        enum: ["Employed", "Self-Employed"],
        required: true,
      },
      details: {
        position: {
          type: String,
        },
        netSalary: {
          type: Number,
        },
        businessName: {
          type: String,
        },
        cacNumber: {
          type: String,
        },
        estimatedMonthlyTurnover: {
          type: Number,
        },
        estimatedNetMonthlyProfit: {
          type: Number,
        },
      },
    },
    guarantor: {
      name: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    loanAmount: {
      type: Number,
    },
    isGranted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Declined", "Accepted"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("LoanApplication", LoanApplicationSchema);
