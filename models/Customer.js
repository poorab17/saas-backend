const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    description: String,
    role: {
        type: String,
        enum: ["superadmin", "tenant", "customer"],
        default: "customer",
    },
    permissions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Permission",
    },
    dbUri: {
        type: String,
        required: true,
    },
    tenantId: {
        type: String,
        required: true,
    },
});
//Hash the password before saving to the database
customerSchema.pre("save", async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});




const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;