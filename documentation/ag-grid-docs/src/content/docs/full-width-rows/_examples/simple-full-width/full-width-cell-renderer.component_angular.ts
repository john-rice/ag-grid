import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="full-width-panel">
            <div class="full-width-flag">
                <img border="0" [src]="flag()" />
            </div>
            <div class="full-width-summary">
                <span class="full-width-title">{{ data()?.name }}</span>
                <br />
                <label>
                    <b>Population:</b>
                    {{ data()?.population }}
                </label>
                <br />
                <label>
                    <b>Language:</b>
                    {{ data()?.language }}
                </label>
                <br />
            </div>
            <div class="full-width-center">
                <p>Sample Text in a Paragraph</p>
                <p>
                    Lorem ipsum dolor sit amet, his mazim necessitatibus te, mea volutpat intellegebat at. Ea nec
                    perpetua liberavisse, et modo rebum persius pri. Velit recteque reprimique quo at. Vis ex persius
                    oporteat, esse voluptatum moderatius te vis. Ex agam suscipit aliquando eum. Mediocrem molestiae id
                    pri, ei cibo facilisis mel. Ne sale nonumy sea. Et vel lorem omittam vulputate. Ne prima impedit
                    percipitur vis, erat summo an pro. Id urbanitas deterruisset cum, at legere oportere has. No saperet
                    lobortis elaboraret qui, alii zril at vix, nulla soluta ornatus per ad. Feugiat consequuntur vis ad,
                    te sit quodsi persequeris, labore perpetua mei ad. Ex sea affert ullamcorper disputationi, sit nisl
                    elit elaboraret te, quodsi doctus verear ut eam. Eu vel malis nominati, per ex melius delenit
                    incorrupte. Partem complectitur sed in. Vix dicta tincidunt ea. Id nec urbanitas voluptaria, pri no
                    nostro disputationi. Falli graeco salutatus pri ea.
                </p>
                <p>
                    Quo ad omnesque phaedrum principes, tale urbanitas constituam et ius, pericula consequat ad est. Ius
                    tractatos referrentur deterruisset an, odio consequuntur sed ad. Ea molestie adipiscing adversarium
                    eos, tale veniam sea no. Mutat nullam philosophia sed ad. Pri eu dicta consulatu, te mollis
                    quaerendum sea. Ei doming commodo euismod vis. Cu modus aliquip inermis his, eos et eirmod regione
                    delicata, at odio definiebas vis.
                </p>
                <p>
                    Lorem ipsum dolor sit amet, his mazim necessitatibus te, mea volutpat intellegebat at. Ea nec
                    perpetua liberavisse, et modo rebum persius pri. Velit recteque reprimique quo at. Vis ex persius
                    oporteat, esse voluptatum moderatius te vis. Ex agam suscipit aliquando eum. Mediocrem molestiae id
                    pri, ei cibo facilisis mel. Ne sale nonumy sea. Et vel lorem omittam vulputate. Ne prima impedit
                    percipitur vis, erat summo an pro. Id urbanitas deterruisset cum, at legere oportere has. No saperet
                    lobortis elaboraret qui, alii zril at vix, nulla soluta ornatus per ad. Feugiat consequuntur vis ad,
                    te sit quodsi persequeris, labore perpetua mei ad. Ex sea affert ullamcorper disputationi, sit nisl
                    elit elaboraret te, quodsi doctus verear ut eam. Eu vel malis nominati, per ex melius delenit
                    incorrupte. Partem complectitur sed in. Vix dicta tincidunt ea. Id nec urbanitas voluptaria, pri no
                    nostro disputationi. Falli graeco salutatus pri ea.
                </p>
                <p>
                    Quo ad omnesque phaedrum principes, tale urbanitas constituam et ius, pericula consequat ad est. Ius
                    tractatos referrentur deterruisset an, odio consequuntur sed ad. Ea molestie adipiscing adversarium
                    eos, tale veniam sea no. Mutat nullam philosophia sed ad. Pri eu dicta consulatu, te mollis
                    quaerendum sea. Ei doming commodo euismod vis. Cu modus aliquip inermis his, eos et eirmod regione
                    delicata, at odio definiebas vis.
                </p>
            </div>
        </div>
    `,
})
export class FullWidthCellRenderer implements ICellRendererAngularComp {
    data = signal<any>(undefined);
    flag = computed(() =>
        this.data()?.code ? `https://www.ag-grid.com/example-assets/large-flags/${this.data().code}.png` : ''
    );

    agInit(params: ICellRendererParams): void {
        this.refresh(params);
    }

    refresh(params: ICellRendererParams): boolean {
        this.data.set(params.node.data);
        return true;
    }
}
