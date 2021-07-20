export function TryCatch(errorMsg?: string) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    const targetMethod = desc.value;

    desc.value = async function (...args: any[]) {
      try {
        return await targetMethod.apply(this, args);
      } catch (e) {
        errorMsg = typeof e === 'string' ? e : errorMsg;
        return { ok: false, error: errorMsg };
      }
    };
  };
}
