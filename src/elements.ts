interface Tag {
    tag: string;
    attr: {class?: string};
    children: Child[];
}

export type Child = Tag | string;

export function tag(tag: string): Tag;
export function tag(tag: string, attributes: {}): Tag;
export function tag(tag: string, children: Child[]): Tag;
export function tag(tag: string, attributes: {}, children: Child[]): Tag;
export function tag(tag: string, attributesOrChildren: {} | Child[] = {}, children: Child[] = []): Tag {
    if (Array.isArray(attributesOrChildren)) {
        return {tag, attr: {}, children: attributesOrChildren};
    } else {
        return {tag, attr: attributesOrChildren, children}
    }
}