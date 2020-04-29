import { Component,Input, OnChanges, SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation, HostBinding} from '@angular/core';

export class Attribute{
  name:string;
  value:string;
}

@Component({
  selector: 'fr-lumos',
  host:{
    '[style.overflow]':"'auto'",
    '[style.width]':"'100%'"
  },
  changeDetection:ChangeDetectionStrategy.OnPush,
  templateUrl: './fr-lumos.component.html',
  encapsulation:ViewEncapsulation.None,
  styleUrls: ['./fr-lumos.component.css']
})
export class FrLumos implements OnChanges{

  constructor(private cd:ChangeDetectorRef) {
    this.temp = document.createElement("div");
  }
  private attrs: Array<Attribute> = new Array<Attribute>();
  private temp:HTMLElement;
  @HostBinding('style.font-size') fontSize$:string = '16px';
  codeRender: string ="";
  @Input() code: string;
  @Input() language: string = "html";

  @Input()
  set fontSize(value:number){
    if(value < 1){
      value = 1;
    }
    this.fontSize$ = value+'px';
    this.cd.markForCheck();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.code.previousValue != changes.code.currentValue){
      if(this.code != null && this.code !== undefined){
        this.codeRender = this.code;
        this.attrs = new Array<Attribute>();
        this.handleCode();
      }
    }
  }
  handleCode(){
    if(this.language == "html"){
      this.temp.innerHTML = this.code;
      this.InitAttributes(this.temp);
      this.renderAngularHtml(this.code);
    }
    else if(this.language == "css"){
      this.renderCss(this.code);
    }
    else{
      this.renderTypescript(this.code);
    }
  }
  renderCss(code:string){
    let highlighted = code;
    highlighted = highlighted.trim();
    highlighted = highlighted.replace(/(.+){/g,'<span class="agc-attr">$1</span>{');
    highlighted = highlighted.replace(/(.+):/g,'<span class="agc-name">$1</span>:');
    highlighted = highlighted.replace(/:(.+);/g,':<span class="agc-value">$1</span>;');
    this.codeRender = highlighted;
    this.cd.markForCheck();
  }
  renderTypescript(code:string){
    let highlighted = code;
    highlighted = highlighted.trim();
    highlighted = highlighted.replace(/(public|protected|private|class|interface|implements|extends|constructor|=>|true|false|this|null)/g,`<span class="agt-second-keyword">$1</span>`);
    highlighted = highlighted.replace(/(import|from|export|if|else|return)/g,`<span class="agt-first-keyword">$1</span>`);
    highlighted = highlighted.replace(/\${(\w+)}/g,`<span class="agt-second-keyword">\${<span class="agt-var">$1</span>}</span>`);
    highlighted = highlighted.replace(/'(.+?)'/g,`<span class="agt-dquotes">'$1'</span>`);// for double quotes and inside double quotes
    highlighted = highlighted.replace(/`(.+?)`/g,'<span class="agt-dquotes">`$1`</span>');// for double quotes and inside double quotes
    highlighted = highlighted.replace(/({\s+|,\s+|;\s+|\(+|{)(\w+?)(}|:)/g,`$1<span class="agt-var">$2</span>$3`);
    highlighted = highlighted.replace(/\[(.+?)\]/g,`[<span class="agt-element">$1</span>]`);// [asd,asd,asd] element in array
    highlighted = highlighted.replace(/([\w.]+)(\s+=)/g,`<span class="agt-var">$1</span>$2`);// variable name
    highlighted = highlighted.replace(/(\.+?)([\w.]+)(\s+=?|\.|;|\))/g,`$1<span class="agt-var">$2</span>$3`);// variable name
    highlighted = highlighted.replace(/(?!.*['`])(\s?)(\w+?)(\.)/g,`$1<span class="agt-var">$2</span>$3`);// variable name
    highlighted = highlighted.replace(/(?!.*['`])(\s+?|)([\w]+)(\s?:|\s+:)/g,`$1<span class="agt-var">$2</span>$3`);// variable name
    highlighted = highlighted.replace(/\((\s?\w+\s?|\s+\w+\s+)\)/g,`(<span class="agt-var">$1</span>)`); //callback parameter ( parameter )
    highlighted = highlighted.replace(/(\S\.)(\w+)\(/g,`$1<span class="agt-function">$2</span>(`);
    highlighted = highlighted.replace(/(?!.)(\s+|\s?)([a-zA-Z]+)\(/g,`$1<span class="agt-function">$2</span>(`);
    highlighted = highlighted.replace(/(\s+?\/\/\s?|^\/\/\s?)(.+?\n)/g,`<span class="agt-comment">$1$2</span>`); //comment
    this.codeRender = highlighted;
    this.cd.markForCheck();
  }
  InitAttributes(element:any){
    let attrs = element.attributes;
    if(attrs !== undefined){
      let attrsLength = attrs.length;
      for(let i = 0; i < attrsLength; i++){
        let attr = new Attribute();
        attr.name = attrs.item(i).name;
        attr.value = attrs.item(i).value;
        this.attrs.push(attr); 
      }
    }
    let childs = element.childNodes;
    let childLength = childs.length;
    for(let i = 0; i< childLength; i++){
      this.InitAttributes(childs.item(i));
    }
  }
  renderAngularHtml(originalCode:string){
    let highlighted = originalCode;
    highlighted = highlighted.trim(); //remove first new line and space
    highlighted = highlighted.replace(/(<|>|\/)/g,'<span class="agh-bracket">$1</span>');// </>
    highlighted = highlighted.replace(/(\/<\/span>|<<\/span>)([\w-]+)(\s|<)/g,'$1<span class="agh-tag">$2</span>$3');// tag
    let length = this.attrs.length;
    for(let i = 0; i < length; i++){
      let attrName = this.attrs[i].name;
      let attrValue = this.attrs[i].value;
      let pattern = this.generatePattern(attrName,attrValue);
      let replaceValue = this.generateBindingTwo(attrName,attrValue);
      if(attrName == "binding"){
        let valueArr = attrValue.split(";");
        replaceValue = "";
        valueArr.forEach(value =>{
          if(value.match(/=/)){
            replaceValue = replaceValue + value.replace(/(.*)=(.*)/g,this.generateBindingTwo("$1","$2"));
          }
          else{
            replaceValue = replaceValue + this.generateBinding(value);
          }
        });
      }
      highlighted = highlighted.replace(pattern,'$1'+replaceValue);
    }
    this.codeRender = highlighted;
    this.cd.markForCheck();
  }
  generatePattern(name:string,value:string):RegExp{
    value = value.replace(/(\[|\]|\*|\(|\)|\!|\?)/g,"\\$1");
    return new RegExp(`\(agh-tag">\\S+<\/span> \|agh-dquotes">.+?<\/span> \|agh-attr">.+?<\/span> \)${name}="${value}"`,'g');
  }
  generateBinding(g1:string):string{
    return `<span class="agh-attr">${g1}</span>`;
  }
  generateBindingTwo(g1:string, g2:string):string{
    return `<span class="agh-attr">${g1}</span><span class="agh-equal">=</span><span class="agh-dquotes">"${g2}"</span>`;
  }
}
