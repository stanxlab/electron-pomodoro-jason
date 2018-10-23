
type Data = {
    str: String;
}

export class Test {

    static init() {
        const data = { str: 'aaa' } as Data;
        console.log('msg from test.ts', data);
    }
}

Test.init();