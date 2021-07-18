export function TryCatch(errorMsg?: string) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const targetMethod = desc.value;

    desc.value = function (...args: any[]) {
      try {
        return targetMethod.apply(this, args);
      } catch (e) {
        console.log(e);
        return { ok: false, error: errorMsg };
      }
    };
  };
}
