interface Timer {
    limit: number;
    elapsed: number;
    update: (dt: number) => void,
    on_timeout: any,
    repeat: boolean
}

const create_timer: (limit: number, on_timeout: any, repeat?: boolean) => Timer = (limit, on_timeout, repeat = false) => ({
    limit,
    on_timeout,
    update: function (dt: number) {
        if (this.elapsed + dt > this.limit) {
            this.on_timeout();
            if (repeat) {
                this.elapsed = 0;
            }
        } else {
            this.elapsed = this.elapsed + dt;
        }
    },
    elapsed: 0,
    repeat
});