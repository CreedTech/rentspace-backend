const Maintenance = require("../models/Maintenance");
const { UpdateAppStatus } = require("../validations/user");

exports.getAppMaintenanceStatus = async (req, res) => {
    try {
        const maintenance = await Maintenance.findOne({ uniqueField: 'single_maintenance_status' });

    if (!maintenance) {
      return res.status(404).json({ message: 'No Status Found' });
    }
        // const maintenance = await Maintenance.find();
        res.status(200).json({
            maintenance,
          });
    }  catch (error) {
        console.log("GET MAINTENANCE STATUS ERROR", error);
        res.status(500).json({
          errors: [
            {
              error: "Server Error",
            },
          ],
        });
      }
}

exports.updateMaintenanceStatus = async (req, res) => {
    const body = UpdateAppStatus.safeParse(req.body);
    if (!body.success) {
        return res.status(400).json({ errors: body.error.issues });
    }
    try {
        const { status } = body.data;
         // Validate the new status
    //   if (!['active', 'inactive'].includes(status)) {
    //     return res.status(400).json({ error: 'Invalid status value' });
    //   }
         // Update the app status
        const updatedStatus = await Maintenance.findOneAndUpdate({ uniqueField: 'single_maintenance_status' }, { status: status }, { new: true });
        if (!updatedStatus) {
            return res.status(404).json({ message: 'No Status found' });
          }
         res.status(200).json({ msg: "App Status Updated Successfully", updatedStatus });
    } catch (error) {
        console.log("UPDATE APP STATUS ERROR=>", error);
        res.status(500).json({ errors: [{ error: "Server Error" }] });
      }
}