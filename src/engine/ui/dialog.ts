interface DialogData {
    speed: number,
    full_text: string
}

type Dialog = Textbox & InputListener & DialogData;

const create_dialog: (x, y, text, w, args: any) => Textbox = (x, y, text, w, { h, small_font, text_color, border_color, background_color, shadow_color } = {}) => {

    function on_input(input: InputState, state: any) {
        if (is_pressed(input, Button.A)) {
            if (this.text.length < this.full_text.length) {
                this.text = this.text;
            } else {
                state.ui = [];
                $input_manager.free_listener();
            }
        }
    }

    const get_wrap_options: (text: string, w: number) => { h: number, wrapped_text: string } = (text, w) => {
        let words = text.split(' ');
        const char_width = small_font ? 4 : 5;
        const char_height = 7;
        const horizontal_margin: number = small_font ? -10 : 6;
        const vertical_margin: number = 6;
        let line_count = 1;
        let line_width: number = 0;
        words = words.map((word: string) => {
            if (line_width + word.length * char_width > w - horizontal_margin) {
                line_width = word.length * char_width + char_width;
                line_count += 1;
                return '\n' + word;
            } else {
                line_width += word.length * char_width + char_width;
                return word;
            }
        })
        return { h: line_count * char_height + vertical_margin, wrapped_text: words.join(' ') };
    }
    const wrap: { h: number, wrapped_text: string } = get_wrap_options(text, w);

    return {
        ...create_textbox(x, y, '', w, wrap.h, small_font, text_color, border_color, background_color, shadow_color),
        life_time: 0,
        speed: 25,
        full_text: wrap.wrapped_text,
        on_input,
        update: function update(dt, state) {
            this.life_time = this.life_time + dt;
            if (this.text.length < this.full_text.length) {
                this.text = this.full_text.substring(0, Math.min(this.life_time * this.speed, this.full_text.length));
            }
        }
    }
};