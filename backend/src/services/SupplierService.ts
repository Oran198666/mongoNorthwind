import { ISupplierModel, SupplierModel } from "../models/supplierModel";
import { ClientError } from "../models/client-error";
import { StatusCode } from "../models/enum";
import { CountryModel } from "../models/countryModel";

class SupplierService {

    public async getAllSuppliers(): Promise<ISupplierModel[]> {
        const suppliers = await SupplierModel.find().populate("country").exec();
        return suppliers;
    }

    public async getOneSupplier(_id: string): Promise<ISupplierModel> {
        const dbSupplier = await SupplierModel.findById(_id).exec();
        if (!dbSupplier) {
            throw new ClientError(StatusCode.NotFound, `_id ${_id} not found.`);
        }
        return dbSupplier;
    }

    public async addSupplier(supplier: ISupplierModel): Promise<ISupplierModel> {
        await ClientError.validate(supplier);
        const dbSupplier = await supplier.save();
        return dbSupplier.populate("country");
    }

    public async updateSupplier(supplier: ISupplierModel): Promise<ISupplierModel> {
        await ClientError.validate(supplier);
        const dbSupplier = await SupplierModel.findByIdAndUpdate(
            supplier._id,
            supplier.toObject(),
            { returnDocument: "after" }
        ).populate("country").exec();
        if (!dbSupplier) {
            throw new ClientError(StatusCode.NotFound, `_id ${supplier._id} not found.`);
        }
        return dbSupplier;
    }

    public async deleteSupplier(_id: string): Promise<void> {
        const dbSupplier = await SupplierModel.findByIdAndDelete(_id).exec();
        if (!dbSupplier) {
            throw new ClientError(StatusCode.NotFound, `_id ${_id} not found.`);
        }
    }

public async getSomeSuppliers(): Promise<any[]> {
    // select * from suppliers
    // const suppliers = await SupplierModel.find().exec();

    // select * from suppliers where city = 'London'
    // const suppliers = await SupplierModel.find({ city: "London" }).exec();

    // select * from suppliers where city = 'London' and address = '49 Gilbert St.'
    // const suppliers = await SupplierModel.find({ city: "London", address: '49 Gilbert St.' }).exec();

    // select * from suppliers where contactTitle = 'Marketing Manager' or contactTitle = 'Sales Representative'
    // const suppliers = await SupplierModel.find({ $or: [{ contactTitle: "Marketing Manager" }, { contactTitle: "Sales Representative" }] }).exec();

    // select * from suppliers where contactTitle in ('Marketing Manager', 'Sales Representative')
    // const suppliers = await SupplierModel.find({ contactTitle: { $in: ["Marketing Manager", "Sales Representative"] } }).exec();

    // select _id, companyName, phone from suppliers
    // const suppliers = await SupplierModel.find({}, { companyName: true, phone: true }).exec();
    // const suppliers = await SupplierModel.find({}, ["companyName", "phone"]).exec();

    // select companyName, phone from suppliers
    // const suppliers = await SupplierModel.find({}, { _id: false, companyName: true, phone: true }).exec();
    // const suppliers = await SupplierModel.find({}, ["-_id", "companyName", "phone"]).exec();

    // select * from suppliers order by companyName
    // const suppliers = await SupplierModel.find({}, {}, { sort: "companyName" }).exec();

    // select * from suppliers order by companyName desc
    // const suppliers = await SupplierModel.find({}, {}, { sort: "-companyName" }).exec();

    // select * from suppliers where contactTitle like '%sales%'
    // const suppliers = await SupplierModel.find({ contactTitle: { $regex: "Sales" } }).exec();

    // select contactTitle, count(*) from suppliers group by contactTitle having count(*) > 1 order by count(*) desc
    // const suppliers = await SupplierModel.aggregate([
    //     { $group: { _id: "$contactTitle", count: { $sum: 1 } } },
    //     { $match: { count: { $gt: 1 } } },
    //     { $sort: { count: -1 } }
    // ]).exec();

    // select companyName, contactName, city from suppliers where city = 'London' or contactTitle = 'Sales Representative' order by companyName
    const suppliers = await SupplierModel.find(
        {
            $or: [
                { city: "London" },
                { contactTitle: "Sales Representative" }
            ]
        },
        { companyName: 1, contactName: 1, city: 1, _id: 0 }
    ).sort({ companyName: 1 }).exec();

    return suppliers;
}
}

export const supplierService = new SupplierService();
