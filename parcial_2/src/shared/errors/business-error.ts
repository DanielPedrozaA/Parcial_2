export function BusinessLogicException(messasge: string, type: number) {
    this.message = messasge;
    this.type = type;
}

export enum BusinessError {
    NOT_FOUND,
    PRECONDITION_FAILED,
    BAD_REQUEST,
}