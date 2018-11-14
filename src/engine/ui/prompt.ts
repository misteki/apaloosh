type Prompt = Textbox;

const create_prompt: (x, y, text, args: any) => Prompt = (x, y, text, { w, h, small_font, text_color, border_color, background_color, shadow_color } = {}) => {
    const height: number = h ? h : 11;
    const width = w ? w : ((small_font ? 4 : 6) * text.length + 6);

    return {
        ...create_textbox(x, y, text, width, height, small_font, text_color, border_color, background_color, shadow_color)
    }
};
