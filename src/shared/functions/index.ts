
export function validateEntity(info: any) {
    const keys = Object.keys(info);
    keys.map((key: string) => {
      let identifier = key;
      const element = info[identifier];
      if (!element) {
        throw new Error(`${identifier} in Registration info is not valid`);
      }
    });
    return true;
  }