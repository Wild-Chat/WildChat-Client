// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function load({ params }: any) {
    const url = params.url
    return {
        url
    }
}