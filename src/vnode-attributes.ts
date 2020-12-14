import {Subscribable} from "./store";

type Booleanish = boolean | 'true' | 'false';
type CssStyle = Partial<Record<keyof CSSStyleDeclaration, Subscribable<string> | string>>

// Copy paste from React with follow regex
// \w*\?: ([\w |"'\[\]]*);
// $1$2 | Subscribable<$2>;

// React.DetailedHTMLProps<React.(\w*<\w*>),.*
// $1;
export interface HTMLAttributes<T> extends Partial<GlobalEventHandlers>{
    // I have added this
    class?: string | Subscribable<string>;

    // Standard HTML Attributes
    accessKey?: string | Subscribable<string>;
    className?: string | Subscribable<string>;
    contentEditable?: Booleanish | "inherit" | Subscribable<Booleanish | "inherit">;
    contextMenu?: string | Subscribable<string>;
    dir?: string | Subscribable<string>;
    draggable?: Booleanish | Subscribable<Booleanish>;
    hidden?: boolean | Subscribable<boolean>;
    innerHTML?: string | Subscribable<string>;
    id?: string | Subscribable<string>;
    lang?: string | Subscribable<string>;
    placeholder?: string | Subscribable<string>;
    slot?: string | Subscribable<string>;
    spellCheck?: Booleanish | Subscribable<Booleanish>;
    style?: CssStyle | Subscribable<CssStyle>;
    tabIndex?: number | Subscribable<number>;
    title?: string | Subscribable<string>;
    translate?: 'yes' | 'no' | Subscribable<'yes' | 'no'>;

    // Unknown
    radioGroup?: string | Subscribable<string>; // <command>, <menuitem>

    // WAI-ARIA
    role?: string | Subscribable<string>;

    // RDFa Attributes
    about?: string | Subscribable<string>;
    datatype?: string | Subscribable<string>;
    inlist?: any | Subscribable<any>;
    prefix?: string | Subscribable<string>;
    property?: string | Subscribable<string>;
    resource?: string | Subscribable<string>;
    typeof?: string | Subscribable<string>;
    vocab?: string | Subscribable<string>;

    // Non-standard Attributes
    autoCapitalize?: string | Subscribable<string>;
    autoCorrect?: string | Subscribable<string>;
    autoSave?: string | Subscribable<string>;
    color?: string | Subscribable<string>;
    itemProp?: string | Subscribable<string>;
    itemScope?: boolean | Subscribable<boolean>;
    itemType?: string | Subscribable<string>;
    itemID?: string | Subscribable<string>;
    itemRef?: string | Subscribable<string>;
    results?: number | Subscribable<number>;
    security?: string | Subscribable<string>;
    unselectable?: 'on' | 'off' | Subscribable<'on' | 'off'>;

    // Living Standard
    /**
     * Hints at the type of data that might be entered by the user while editing the element or its contents
     * @see https://html.spec.whatwg.org/multipage/interaction.html#input-modalities:-the-inputmode-attribute
     */
    inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search' | Subscribable<'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'>;
    /**
     * Specify that a standard HTML element should behave like a defined custom built-in element
     * @see https://html.spec.whatwg.org/multipage/custom-elements.html#attr-is
     */
    is?: string | Subscribable<string>;
}


interface AllHTMLAttributes<T> extends HTMLAttributes<T> {
    // Standard HTML Attributes
    accept?: string | Subscribable<string>;
    acceptCharset?: string | Subscribable<string>;
    action?: string | Subscribable<string>;
    allowFullScreen?: boolean | Subscribable<boolean>;
    allowTransparency?: boolean | Subscribable<boolean>;
    alt?: string | Subscribable<string>;
    as?: string | Subscribable<string>;
    async?: boolean | Subscribable<boolean>;
    autoComplete?: string | Subscribable<string>;
    autoFocus?: boolean | Subscribable<boolean>;
    autoPlay?: boolean | Subscribable<boolean>;
    capture?: boolean | string | Subscribable<boolean | string>;
    cellPadding?: number | string | Subscribable<number | string>;
    cellSpacing?: number | string | Subscribable<number | string>;
    charSet?: string | Subscribable<string>;
    challenge?: string | Subscribable<string>;
    checked?: boolean | Subscribable<boolean>;
    cite?: string | Subscribable<string>;
    classID?: string | Subscribable<string>;
    cols?: number | Subscribable<number>;
    colSpan?: number | Subscribable<number>;
    content?: string | Subscribable<string>;
    controls?: boolean | Subscribable<boolean>;
    coords?: string | Subscribable<string>;
    crossOrigin?: string | Subscribable<string>;
    data?: string | Subscribable<string>;
    dateTime?: string | Subscribable<string>;
    default?: boolean | Subscribable<boolean>;
    defer?: boolean | Subscribable<boolean>;
    disabled?: boolean | Subscribable<boolean>;
    download?: any | Subscribable<any>;
    encType?: string | Subscribable<string>;
    form?: string | Subscribable<string>;
    formAction?: string | Subscribable<string>;
    formEncType?: string | Subscribable<string>;
    formMethod?: string | Subscribable<string>;
    formNoValidate?: boolean | Subscribable<boolean>;
    formTarget?: string | Subscribable<string>;
    frameBorder?: number | string | Subscribable<number | string>;
    headers?: string | Subscribable<string>;
    height?: number | string | Subscribable<number | string>;
    high?: number | Subscribable<number>;
    href?: string | Subscribable<string>;
    hrefLang?: string | Subscribable<string>;
    htmlFor?: string | Subscribable<string>;
    httpEquiv?: string | Subscribable<string>;
    integrity?: string | Subscribable<string>;
    keyParams?: string | Subscribable<string>;
    keyType?: string | Subscribable<string>;
    kind?: string | Subscribable<string>;
    label?: string | Subscribable<string>;
    list?: string | Subscribable<string>;
    loop?: boolean | Subscribable<boolean>;
    low?: number | Subscribable<number>;
    manifest?: string | Subscribable<string>;
    marginHeight?: number | Subscribable<number>;
    marginWidth?: number | Subscribable<number>;
    max?: number | string | Subscribable<number | string>;
    maxLength?: number | Subscribable<number>;
    media?: string | Subscribable<string>;
    mediaGroup?: string | Subscribable<string>;
    method?: string | Subscribable<string>;
    min?: number | string | Subscribable<number | string>;
    minLength?: number | Subscribable<number>;
    multiple?: boolean | Subscribable<boolean>;
    muted?: boolean | Subscribable<boolean>;
    name?: string | Subscribable<string>;
    nonce?: string | Subscribable<string>;
    noValidate?: boolean | Subscribable<boolean>;
    open?: boolean | Subscribable<boolean>;
    optimum?: number | Subscribable<number>;
    pattern?: string | Subscribable<string>;
    placeholder?: string | Subscribable<string>;
    playsInline?: boolean | Subscribable<boolean>;
    poster?: string | Subscribable<string>;
    preload?: string | Subscribable<string>;
    readOnly?: boolean | Subscribable<boolean>;
    rel?: string | Subscribable<string>;
    required?: boolean | Subscribable<boolean>;
    reversed?: boolean | Subscribable<boolean>;
    rows?: number | Subscribable<number>;
    rowSpan?: number | Subscribable<number>;
    sandbox?: string | Subscribable<string>;
    scope?: string | Subscribable<string>;
    scoped?: boolean | Subscribable<boolean>;
    scrolling?: string | Subscribable<string>;
    seamless?: boolean | Subscribable<boolean>;
    selected?: boolean | Subscribable<boolean>;
    shape?: string | Subscribable<string>;
    size?: number | Subscribable<number>;
    sizes?: string | Subscribable<string>;
    span?: number | Subscribable<number>;
    src?: string | Subscribable<string>;
    srcDoc?: string | Subscribable<string>;
    srcLang?: string | Subscribable<string>;
    srcSet?: string | Subscribable<string>;
    start?: number | Subscribable<number>;
    step?: number | string | Subscribable<number | string>;
    summary?: string | Subscribable<string>;
    target?: string | Subscribable<string>;
    type?: string | Subscribable<string>;
    useMap?: string | Subscribable<string>;
    value?: string | string[] | number | Subscribable<string | string[] | number>;
    width?: number | string | Subscribable<number | string>;
    wmode?: string | Subscribable<string>;
    wrap?: string | Subscribable<string>;
}

export interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
    download?: any | Subscribable<any>;
    href?: string | Subscribable<string>;
    hrefLang?: string | Subscribable<string>;
    media?: string | Subscribable<string>;
    ping?: string | Subscribable<string>;
    rel?: string | Subscribable<string>;
    target?: string | Subscribable<string>;
    type?: string | Subscribable<string>;
    referrerPolicy?: string | Subscribable<string>;
}

// tslint:disable-next-line:no-empty-interface
interface AudioHTMLAttributes<T> extends MediaHTMLAttributes<T> {}

interface AreaHTMLAttributes<T> extends HTMLAttributes<T> {
    alt?: string | Subscribable<string>;
    coords?: string | Subscribable<string>;
    download?: any | Subscribable<any>;
    href?: string | Subscribable<string>;
    hrefLang?: string | Subscribable<string>;
    media?: string | Subscribable<string>;
    rel?: string | Subscribable<string>;
    shape?: string | Subscribable<string>;
    target?: string | Subscribable<string>;
}

interface BaseHTMLAttributes<T> extends HTMLAttributes<T> {
    href?: string | Subscribable<string>;
    target?: string | Subscribable<string>;
}

interface BlockquoteHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string | Subscribable<string>;
}

interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean | Subscribable<boolean>;
    disabled?: boolean | Subscribable<boolean>;
    form?: string | Subscribable<string>;
    formAction?: string | Subscribable<string>;
    formEncType?: string | Subscribable<string>;
    formMethod?: string | Subscribable<string>;
    formNoValidate?: boolean | Subscribable<boolean>;
    formTarget?: string | Subscribable<string>;
    name?: string | Subscribable<string>;
    type?: 'submit' | 'reset' | 'button' | Subscribable<'submit' | 'reset' | 'button'>;
    value?: string | string[] | number | Subscribable<string | string[] | number>;
}

interface CanvasHTMLAttributes<T> extends HTMLAttributes<T> {
    height?: number | string | Subscribable<number | string>;
    width?: number | string | Subscribable<number | string>;
}

interface ColHTMLAttributes<T> extends HTMLAttributes<T> {
    span?: number | Subscribable<number>;
    width?: number | string | Subscribable<number | string>;
}

interface ColgroupHTMLAttributes<T> extends HTMLAttributes<T> {
    span?: number | Subscribable<number>;
}

interface DataHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: string | string[] | number | Subscribable<string | string[] | number>;
}

interface DetailsHTMLAttributes<T> extends HTMLAttributes<T> {
    open?: boolean | Subscribable<boolean>;
}

interface DelHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string | Subscribable<string>;
    dateTime?: string | Subscribable<string>;
}

interface DialogHTMLAttributes<T> extends HTMLAttributes<T> {
    open?: boolean | Subscribable<boolean>;
}

interface EmbedHTMLAttributes<T> extends HTMLAttributes<T> {
    height?: number | string | Subscribable<number | string>;
    src?: string | Subscribable<string>;
    type?: string | Subscribable<string>;
    width?: number | string | Subscribable<number | string>;
}

interface FieldsetHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean | Subscribable<boolean>;
    form?: string | Subscribable<string>;
    name?: string | Subscribable<string>;
}

interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    acceptCharset?: string | Subscribable<string>;
    action?: string | Subscribable<string>;
    autoComplete?: string | Subscribable<string>;
    encType?: string | Subscribable<string>;
    method?: string | Subscribable<string>;
    name?: string | Subscribable<string>;
    noValidate?: boolean | Subscribable<boolean>;
    target?: string | Subscribable<string>;
}

interface HtmlHTMLAttributes<T> extends HTMLAttributes<T> {
    manifest?: string | Subscribable<string>;
}

interface IframeHTMLAttributes<T> extends HTMLAttributes<T> {
    allow?: string | Subscribable<string>;
    allowFullScreen?: boolean | Subscribable<boolean>;
    allowTransparency?: boolean | Subscribable<boolean>;
    frameBorder?: number | string | Subscribable<number | string>;
    height?: number | string | Subscribable<number | string>;
    marginHeight?: number | Subscribable<number>;
    marginWidth?: number | Subscribable<number>;
    name?: string | Subscribable<string>;
    referrerPolicy?: string | Subscribable<string>;
    sandbox?: string | Subscribable<string>;
    scrolling?: string | Subscribable<string>;
    seamless?: boolean | Subscribable<boolean>;
    src?: string | Subscribable<string>;
    srcDoc?: string | Subscribable<string>;
    width?: number | string | Subscribable<number | string>;
}

interface ImgHTMLAttributes<T> extends HTMLAttributes<T> {
    alt?: string | Subscribable<string>;
    crossOrigin?: "anonymous" | "use-credentials" | "";
    decoding?: "async" | "auto" | "sync" | Subscribable<"async" | "auto" | "sync">;
    height?: number | string | Subscribable<number | string>;
    loading?: "eager" | "lazy" | Subscribable<"eager" | "lazy">;
    referrerPolicy?: "no-referrer" | "origin" | "unsafe-url";
    sizes?: string | Subscribable<string>;
    src?: string | Subscribable<string>;
    srcSet?: string | Subscribable<string>;
    useMap?: string | Subscribable<string>;
    width?: number | string | Subscribable<number | string>;
}

interface InsHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string | Subscribable<string>;
    dateTime?: string | Subscribable<string>;
}

export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    accept?: string | Subscribable<string>;
    alt?: string | Subscribable<string>;
    autoComplete?: string | Subscribable<string>;
    autoFocus?: boolean | Subscribable<boolean>;
    capture?: boolean | string | Subscribable<boolean | string>; // https://www.w3.org/TR/html-media-capture/#the-capture-attribute
    checked?: boolean | Subscribable<boolean>;
    crossOrigin?: string | Subscribable<string>;
    disabled?: boolean | Subscribable<boolean>;
    form?: string | Subscribable<string>;
    formAction?: string | Subscribable<string>;
    formEncType?: string | Subscribable<string>;
    formMethod?: string | Subscribable<string>;
    formNoValidate?: boolean | Subscribable<boolean>;
    formTarget?: string | Subscribable<string>;
    height?: number | string | Subscribable<number | string>;
    list?: string | Subscribable<string>;
    max?: number | string | Subscribable<number | string>;
    maxLength?: number | Subscribable<number>;
    min?: number | string | Subscribable<number | string>;
    minLength?: number | Subscribable<number>;
    multiple?: boolean | Subscribable<boolean>;
    name?: string | Subscribable<string>;
    pattern?: string | Subscribable<string>;
    placeholder?: string | Subscribable<string>;
    readOnly?: boolean | Subscribable<boolean>;
    required?: boolean | Subscribable<boolean>;
    size?: number | Subscribable<number>;
    src?: string | Subscribable<string>;
    step?: number | string | Subscribable<number | string>;
    type?: string | Subscribable<string>;
    value?: Subscribable<string | string[] | number> | string | string[] | number;
    width?: number | string | Subscribable<number | string>;

    // onChange?: ChangeEventHandler<T>;
}

interface KeygenHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean | Subscribable<boolean>;
    challenge?: string | Subscribable<string>;
    disabled?: boolean | Subscribable<boolean>;
    form?: string | Subscribable<string>;
    keyType?: string | Subscribable<string>;
    keyParams?: string | Subscribable<string>;
    name?: string | Subscribable<string>;
}

interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string | Subscribable<string>;
    htmlFor?: string | Subscribable<string>;
}

interface LiHTMLAttributes<T> extends HTMLAttributes<T> {
    value?: string | string[] | number | Subscribable<string | string[] | number>;
}

interface LinkHTMLAttributes<T> extends HTMLAttributes<T> {
    as?: string | Subscribable<string>;
    crossOrigin?: string | Subscribable<string>;
    href?: string | Subscribable<string>;
    hrefLang?: string | Subscribable<string>;
    integrity?: string | Subscribable<string>;
    media?: string | Subscribable<string>;
    rel?: string | Subscribable<string>;
    sizes?: string | Subscribable<string>;
    type?: string | Subscribable<string>;
    charSet?: string | Subscribable<string>;
}

interface MapHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string | Subscribable<string>;
}

interface MenuHTMLAttributes<T> extends HTMLAttributes<T> {
    type?: string | Subscribable<string>;
}

interface MediaHTMLAttributes<T> extends HTMLAttributes<T> {
    autoPlay?: boolean | Subscribable<boolean>;
    controls?: boolean | Subscribable<boolean>;
    controlsList?: string | Subscribable<string>;
    crossOrigin?: string | Subscribable<string>;
    loop?: boolean | Subscribable<boolean>;
    mediaGroup?: string | Subscribable<string>;
    muted?: boolean | Subscribable<boolean>;
    playsInline?: boolean | Subscribable<boolean>;
    preload?: string | Subscribable<string>;
    src?: string | Subscribable<string>;
}

interface MetaHTMLAttributes<T> extends HTMLAttributes<T> {
    charSet?: string | Subscribable<string>;
    content?: string | Subscribable<string>;
    httpEquiv?: string | Subscribable<string>;
    name?: string | Subscribable<string>;
}

interface MeterHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string | Subscribable<string>;
    high?: number | Subscribable<number>;
    low?: number | Subscribable<number>;
    max?: number | string | Subscribable<number | string>;
    min?: number | string | Subscribable<number | string>;
    optimum?: number | Subscribable<number>;
    value?: string | string[] | number | Subscribable<string | string[] | number>;
}

interface QuoteHTMLAttributes<T> extends HTMLAttributes<T> {
    cite?: string | Subscribable<string>;
}

interface ObjectHTMLAttributes<T> extends HTMLAttributes<T> {
    classID?: string | Subscribable<string>;
    data?: string | Subscribable<string>;
    form?: string | Subscribable<string>;
    height?: number | string | Subscribable<number | string>;
    name?: string | Subscribable<string>;
    type?: string | Subscribable<string>;
    useMap?: string | Subscribable<string>;
    width?: number | string | Subscribable<number | string>;
    wmode?: string | Subscribable<string>;
}

interface OlHTMLAttributes<T> extends HTMLAttributes<T> {
    reversed?: boolean | Subscribable<boolean>;
    start?: number | Subscribable<number>;
    type?: '1' | 'a' | 'A' | 'i' | 'I' | Subscribable<'1' | 'a' | 'A' | 'i' | 'I'>;
}

interface OptgroupHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean | Subscribable<boolean>;
    label?: string | Subscribable<string>;
}

interface OptionHTMLAttributes<T> extends HTMLAttributes<T> {
    disabled?: boolean | Subscribable<boolean>;
    label?: string | Subscribable<string>;
    selected?: boolean | Subscribable<boolean>;
    value?: string | string[] | number | Subscribable<string | string[] | number>;
}

interface OutputHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string | Subscribable<string>;
    htmlFor?: string | Subscribable<string>;
    name?: string | Subscribable<string>;
}

interface ParamHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string | Subscribable<string>;
    value?: string | string[] | number | Subscribable<string | string[] | number>;
}

interface ProgressHTMLAttributes<T> extends HTMLAttributes<T> {
    max?: number | string | Subscribable<number | string>;
    value?: string | string[] | number | Subscribable<string | string[] | number>;
}

interface SlotHTMLAttributes<T> extends HTMLAttributes<T> {
    name?: string | Subscribable<string>;
}

interface ScriptHTMLAttributes<T> extends HTMLAttributes<T> {
    async?: boolean | Subscribable<boolean>;
    charSet?: string | Subscribable<string>;
    crossOrigin?: string | Subscribable<string>;
    defer?: boolean | Subscribable<boolean>;
    integrity?: string | Subscribable<string>;
    noModule?: boolean | Subscribable<boolean>;
    nonce?: string | Subscribable<string>;
    src?: string | Subscribable<string>;
    type?: string | Subscribable<string>;
}

interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
    autoComplete?: string | Subscribable<string>;
    autoFocus?: boolean | Subscribable<boolean>;
    disabled?: boolean | Subscribable<boolean>;
    form?: string | Subscribable<string>;
    multiple?: boolean | Subscribable<boolean>;
    name?: string | Subscribable<string>;
    required?: boolean | Subscribable<boolean>;
    size?: number | Subscribable<number>;
    value?: string | string[] | number | Subscribable<string | string[] | number>;
    // onChange?: ChangeEventHandler<T>;
}

interface SourceHTMLAttributes<T> extends HTMLAttributes<T> {
    media?: string | Subscribable<string>;
    sizes?: string | Subscribable<string>;
    src?: string | Subscribable<string>;
    srcSet?: string | Subscribable<string>;
    type?: string | Subscribable<string>;
}

interface StyleHTMLAttributes<T> extends HTMLAttributes<T> {
    media?: string | Subscribable<string>;
    nonce?: string | Subscribable<string>;
    scoped?: boolean | Subscribable<boolean>;
    type?: string | Subscribable<string>;
}

interface TableHTMLAttributes<T> extends HTMLAttributes<T> {
    cellPadding?: number | string | Subscribable<number | string>;
    cellSpacing?: number | string | Subscribable<number | string>;
    summary?: string | Subscribable<string>;
}

interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
    autoComplete?: string | Subscribable<string>;
    autoFocus?: boolean | Subscribable<boolean>;
    cols?: number | Subscribable<number>;
    dirName?: string | Subscribable<string>;
    disabled?: boolean | Subscribable<boolean>;
    form?: string | Subscribable<string>;
    maxLength?: number | Subscribable<number>;
    minLength?: number | Subscribable<number>;
    name?: string | Subscribable<string>;
    placeholder?: string | Subscribable<string>;
    readOnly?: boolean | Subscribable<boolean>;
    required?: boolean | Subscribable<boolean>;
    rows?: number | Subscribable<number>;
    value?: string | string[] | number | Subscribable<string | string[] | number>;
    wrap?: string | Subscribable<string>;

    // onChange?: ChangeEventHandler<T>;
}

interface TdHTMLAttributes<T> extends HTMLAttributes<T> {
    align?: "left" | "center" | "right" | "justify" | "char" | Subscribable<"left" | "center" | "right" | "justify" | "char">;
    colSpan?: number | Subscribable<number>;
    headers?: string | Subscribable<string>;
    rowSpan?: number | Subscribable<number>;
    scope?: string | Subscribable<string>;
    abbr?: string | Subscribable<string>;
    valign?: "top" | "middle" | "bottom" | "baseline" | Subscribable<"top" | "middle" | "bottom" | "baseline">;
}

interface ThHTMLAttributes<T> extends HTMLAttributes<T> {
    align?: "left" | "center" | "right" | "justify" | "char" | Subscribable<"left" | "center" | "right" | "justify" | "char">;
    colSpan?: number | Subscribable<number>;
    headers?: string | Subscribable<string>;
    rowSpan?: number | Subscribable<number>;
    scope?: string | Subscribable<string>;
    abbr?: string | Subscribable<string>;
}

interface TimeHTMLAttributes<T> extends HTMLAttributes<T> {
    dateTime?: string | Subscribable<string>;
}

interface TrackHTMLAttributes<T> extends HTMLAttributes<T> {
    default?: boolean | Subscribable<boolean>;
    kind?: string | Subscribable<string>;
    label?: string | Subscribable<string>;
    src?: string | Subscribable<string>;
    srcLang?: string | Subscribable<string>;
}

interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
    height?: number | string | Subscribable<number | string>;
    playsInline?: boolean | Subscribable<boolean>;
    poster?: string | Subscribable<string>;
    width?: number | string | Subscribable<number | string>;
    disablePictureInPicture?: boolean | Subscribable<boolean>;
}

// Copy paste from react where the following regular expression is used.
// React.DetailedHTMLProps<React.(\w*<\w*>),.*
// $1;
declare global {
    namespace JSX {
        interface IntrinsicElements {
            // HTML
            a: AnchorHTMLAttributes<HTMLAnchorElement>;
            abbr: HTMLAttributes<HTMLElement>;
            address: HTMLAttributes<HTMLElement>;
            area: AreaHTMLAttributes<HTMLAreaElement>;
            article: HTMLAttributes<HTMLElement>;
            aside: HTMLAttributes<HTMLElement>;
            audio: AudioHTMLAttributes<HTMLAudioElement>;
            b: HTMLAttributes<HTMLElement>;
            base: BaseHTMLAttributes<HTMLBaseElement>;
            bdi: HTMLAttributes<HTMLElement>;
            bdo: HTMLAttributes<HTMLElement>;
            big: HTMLAttributes<HTMLElement>;
            blockquote: BlockquoteHTMLAttributes<HTMLElement>;
            body: HTMLAttributes<HTMLBodyElement>;
            br: HTMLAttributes<HTMLBRElement>;
            button: ButtonHTMLAttributes<HTMLButtonElement>;
            canvas: CanvasHTMLAttributes<HTMLCanvasElement>;
            caption: HTMLAttributes<HTMLElement>;
            cite: HTMLAttributes<HTMLElement>;
            code: HTMLAttributes<HTMLElement>;
            col: ColHTMLAttributes<HTMLTableColElement>;
            colgroup: ColgroupHTMLAttributes<HTMLTableColElement>;
            data: DataHTMLAttributes<HTMLDataElement>;
            datalist: HTMLAttributes<HTMLDataListElement>;
            dd: HTMLAttributes<HTMLElement>;
            del: DelHTMLAttributes<HTMLElement>;
            details: DetailsHTMLAttributes<HTMLElement>;
            dfn: HTMLAttributes<HTMLElement>;
            dialog: DialogHTMLAttributes<HTMLDialogElement>;
            div: HTMLAttributes<HTMLDivElement>;
            dl: HTMLAttributes<HTMLDListElement>;
            dt: HTMLAttributes<HTMLElement>;
            em: HTMLAttributes<HTMLElement>;
            embed: EmbedHTMLAttributes<HTMLEmbedElement>;
            fieldset: FieldsetHTMLAttributes<HTMLFieldSetElement>;
            figcaption: HTMLAttributes<HTMLElement>;
            figure: HTMLAttributes<HTMLElement>;
            footer: HTMLAttributes<HTMLElement>;
            form: FormHTMLAttributes<HTMLFormElement>;
            h1: HTMLAttributes<HTMLHeadingElement>;
            h2: HTMLAttributes<HTMLHeadingElement>;
            h3: HTMLAttributes<HTMLHeadingElement>;
            h4: HTMLAttributes<HTMLHeadingElement>;
            h5: HTMLAttributes<HTMLHeadingElement>;
            h6: HTMLAttributes<HTMLHeadingElement>;
            head: HTMLAttributes<HTMLHeadElement>;
            header: HTMLAttributes<HTMLElement>;
            hgroup: HTMLAttributes<HTMLElement>;
            hr: HTMLAttributes<HTMLHRElement>;
            html: HtmlHTMLAttributes<HTMLHtmlElement>;
            i: HTMLAttributes<HTMLElement>;
            iframe: IframeHTMLAttributes<HTMLIFrameElement>;
            img: ImgHTMLAttributes<HTMLImageElement>;
            input: InputHTMLAttributes<HTMLInputElement>;
            ins: InsHTMLAttributes<HTMLModElement>;
            kbd: HTMLAttributes<HTMLElement>;
            keygen: KeygenHTMLAttributes<HTMLElement>;
            label: LabelHTMLAttributes<HTMLLabelElement>;
            legend: HTMLAttributes<HTMLLegendElement>;
            li: LiHTMLAttributes<HTMLLIElement>;
            link: LinkHTMLAttributes<HTMLLinkElement>;
            main: HTMLAttributes<HTMLElement>;
            map: MapHTMLAttributes<HTMLMapElement>;
            mark: HTMLAttributes<HTMLElement>;
            menu: MenuHTMLAttributes<HTMLElement>;
            menuitem: HTMLAttributes<HTMLElement>;
            meta: MetaHTMLAttributes<HTMLMetaElement>;
            meter: MeterHTMLAttributes<HTMLElement>;
            nav: HTMLAttributes<HTMLElement>;
            noindex: HTMLAttributes<HTMLElement>;
            noscript: HTMLAttributes<HTMLElement>;
            object: ObjectHTMLAttributes<HTMLObjectElement>;
            ol: OlHTMLAttributes<HTMLOListElement>;
            optgroup: OptgroupHTMLAttributes<HTMLOptGroupElement>;
            option: OptionHTMLAttributes<HTMLOptionElement>;
            output: OutputHTMLAttributes<HTMLElement>;
            p: HTMLAttributes<HTMLParagraphElement>;
            param: ParamHTMLAttributes<HTMLParamElement>;
            picture: HTMLAttributes<HTMLElement>;
            pre: HTMLAttributes<HTMLPreElement>;
            progress: ProgressHTMLAttributes<HTMLProgressElement>;
            q: QuoteHTMLAttributes<HTMLQuoteElement>;
            rp: HTMLAttributes<HTMLElement>;
            rt: HTMLAttributes<HTMLElement>;
            ruby: HTMLAttributes<HTMLElement>;
            s: HTMLAttributes<HTMLElement>;
            samp: HTMLAttributes<HTMLElement>;
            slot: SlotHTMLAttributes<HTMLSlotElement>;
            script: ScriptHTMLAttributes<HTMLScriptElement>;
            section: HTMLAttributes<HTMLElement>;
            select: SelectHTMLAttributes<HTMLSelectElement>;
            small: HTMLAttributes<HTMLElement>;
            source: SourceHTMLAttributes<HTMLSourceElement>;
            span: HTMLAttributes<HTMLSpanElement>;
            strong: HTMLAttributes<HTMLElement>;
            style: StyleHTMLAttributes<HTMLStyleElement>;
            sub: HTMLAttributes<HTMLElement>;
            summary: HTMLAttributes<HTMLElement>;
            sup: HTMLAttributes<HTMLElement>;
            table: TableHTMLAttributes<HTMLTableElement>;
            template: HTMLAttributes<HTMLTemplateElement>;
            tbody: HTMLAttributes<HTMLTableSectionElement>;
            td: TdHTMLAttributes<HTMLTableDataCellElement>;
            textarea: TextareaHTMLAttributes<HTMLTextAreaElement>;
            tfoot: HTMLAttributes<HTMLTableSectionElement>;
            th: ThHTMLAttributes<HTMLTableHeaderCellElement>;
            thead: HTMLAttributes<HTMLTableSectionElement>;
            time: TimeHTMLAttributes<HTMLElement>;
            title: HTMLAttributes<HTMLTitleElement>;
            tr: HTMLAttributes<HTMLTableRowElement>;
            track: TrackHTMLAttributes<HTMLTrackElement>;
            u: HTMLAttributes<HTMLElement>;
            ul: HTMLAttributes<HTMLUListElement>;
            "var": HTMLAttributes<HTMLElement>;
            video: VideoHTMLAttributes<HTMLVideoElement>;
            wbr: HTMLAttributes<HTMLElement>;
            //webview: WebViewHTMLAttributes<HTMLWebViewElement>;

            // SVG
            // svg: React.SVGProps<SVGSVGElement>;
            //
            // animate: React.SVGProps<SVGElement>; // TODO: It is SVGAnimateElement but is not in TypeScript's lib.dom.d.ts for now.
            // animateMotion: React.SVGProps<SVGElement>;
            // animateTransform: React.SVGProps<SVGElement>; // TODO: It is SVGAnimateTransformElement but is not in TypeScript's lib.dom.d.ts for now.
            // circle: React.SVGProps<SVGCircleElement>;
            // clipPath: React.SVGProps<SVGClipPathElement>;
            // defs: React.SVGProps<SVGDefsElement>;
            // desc: React.SVGProps<SVGDescElement>;
            // ellipse: React.SVGProps<SVGEllipseElement>;
            // feBlend: React.SVGProps<SVGFEBlendElement>;
            // feColorMatrix: React.SVGProps<SVGFEColorMatrixElement>;
            // feComponentTransfer: React.SVGProps<SVGFEComponentTransferElement>;
            // feComposite: React.SVGProps<SVGFECompositeElement>;
            // feConvolveMatrix: React.SVGProps<SVGFEConvolveMatrixElement>;
            // feDiffuseLighting: React.SVGProps<SVGFEDiffuseLightingElement>;
            // feDisplacementMap: React.SVGProps<SVGFEDisplacementMapElement>;
            // feDistantLight: React.SVGProps<SVGFEDistantLightElement>;
            // feDropShadow: React.SVGProps<SVGFEDropShadowElement>;
            // feFlood: React.SVGProps<SVGFEFloodElement>;
            // feFuncA: React.SVGProps<SVGFEFuncAElement>;
            // feFuncB: React.SVGProps<SVGFEFuncBElement>;
            // feFuncG: React.SVGProps<SVGFEFuncGElement>;
            // feFuncR: React.SVGProps<SVGFEFuncRElement>;
            // feGaussianBlur: React.SVGProps<SVGFEGaussianBlurElement>;
            // feImage: React.SVGProps<SVGFEImageElement>;
            // feMerge: React.SVGProps<SVGFEMergeElement>;
            // feMergeNode: React.SVGProps<SVGFEMergeNodeElement>;
            // feMorphology: React.SVGProps<SVGFEMorphologyElement>;
            // feOffset: React.SVGProps<SVGFEOffsetElement>;
            // fePointLight: React.SVGProps<SVGFEPointLightElement>;
            // feSpecularLighting: React.SVGProps<SVGFESpecularLightingElement>;
            // feSpotLight: React.SVGProps<SVGFESpotLightElement>;
            // feTile: React.SVGProps<SVGFETileElement>;
            // feTurbulence: React.SVGProps<SVGFETurbulenceElement>;
            // filter: React.SVGProps<SVGFilterElement>;
            // foreignObject: React.SVGProps<SVGForeignObjectElement>;
            // g: React.SVGProps<SVGGElement>;
            // image: React.SVGProps<SVGImageElement>;
            // line: React.SVGProps<SVGLineElement>;
            // linearGradient: React.SVGProps<SVGLinearGradientElement>;
            // marker: React.SVGProps<SVGMarkerElement>;
            // mask: React.SVGProps<SVGMaskElement>;
            // metadata: React.SVGProps<SVGMetadataElement>;
            // mpath: React.SVGProps<SVGElement>;
            // path: React.SVGProps<SVGPathElement>;
            // pattern: React.SVGProps<SVGPatternElement>;
            // polygon: React.SVGProps<SVGPolygonElement>;
            // polyline: React.SVGProps<SVGPolylineElement>;
            // radialGradient: React.SVGProps<SVGRadialGradientElement>;
            // rect: React.SVGProps<SVGRectElement>;
            // stop: React.SVGProps<SVGStopElement>;
            // switch: React.SVGProps<SVGSwitchElement>;
            // symbol: React.SVGProps<SVGSymbolElement>;
            // text: React.SVGProps<SVGTextElement>;
            // textPath: React.SVGProps<SVGTextPathElement>;
            // tspan: React.SVGProps<SVGTSpanElement>;
            // use: React.SVGProps<SVGUseElement>;
            // view: React.SVGProps<SVGViewElement>;
        }
    }
}