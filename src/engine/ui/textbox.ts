interface TextBoxData {
    w: number,
    h: number,
    text_color: number,
    border_color: number,
    background_color: number,
    shadow_color: number,
    text: string,
    small_font: boolean
}

type Textbox = TextBoxData & Position;

const create_textbox: (x, y, text, w?, h?, small_font?, text_color?, border_color?, background_color?, shadow_color?) => Textbox = (x, y, text, w = 0, h = 0, small_font = false, text_color = 15, border_color = 15, background_color = 0, shadow_color = 0) => {
    return {
        x,
        y,
        w,
        h,
        text_color,
        border_color,
        background_color,
        shadow_color,
        text,
        small_font,
        draw: function () {
            rect(this.x, this.y, this.w, this.h, this.border_color);
            rect(this.x + 1, this.y + 1, this.w - 2, this.h - 2, this.background_color);
            line(this.x + 1, this.y + this.h, this.x + this.w - 1, this.y + this.h, this.shadow_color);
            line(this.x + this.w, this.y + 1, this.x + this.w, this.y + this.h, this.shadow_color);
            print(this.text, this.x + 4, this.y + 4, this.text_color, false, 1, small_font);
        }
    }
}
