import { MongoClient } from "mongodb";

const uri = "mongodb+srv://akkhilsharmaclass:AoPvk0JAMOPSHG1d@cluster0.j8cbmc1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your connection string

let client: MongoClient;
let connectTodb: any;

export const connectToDb = async () => {
  if (!client) {
    client = await MongoClient.connect(uri);
    connectTodb = client.db();
  }
  return connectTodb;
};
