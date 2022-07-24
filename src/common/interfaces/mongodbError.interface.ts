export interface MongodbError {
  index: number;
  code: number;
  keyPattern: {
    [string: string]: number;
  };
  keyValue: {
    [string: string]: any;
  };
}
