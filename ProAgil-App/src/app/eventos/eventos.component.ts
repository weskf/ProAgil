import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService} from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { templateJitUrl } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = "Eventos";
  
  eventoForm = new FormGroup({
    tema: new FormControl(),
    local: new FormControl(),
    dataEvento: new FormControl(),
    qtdPessoas: new FormControl(),
    imagemUrl: new FormControl(),
    telefone: new FormControl(),
    email: new FormControl(),    
  });

  eventosFiltrados!: Evento[];
  eventos!: Evento[];
  evento!: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modoSalvar = 'Post';
  bodyDeletarEvento = '';
  dataEvento: string;
  file: File;
  fileNameToUpdate: string;
  dataAtual: string;

  constructor(
    private eventoService: EventoService
  , private modalService: BsModalService
  , private fb: FormBuilder
  , private localService: BsLocaleService
  , private toastr: ToastrService) {
    this.localService.use('pt-br');  
    this.validation();  
  }

  ngOnInit() {
    this.getEventos();
  }

  _filtroLista: string = "";

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  openModal(template: any){
    this.eventoForm.reset();
    template.show(template);
  }  

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  editarEvento(evento: Evento, template: any){
    this.modoSalvar = 'Put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imagemUrl.toString();
    this.evento.imagemUrl = '';
    this.eventoForm.patchValue(this.evento);    
  }

  novoEvento(template: any){
    this.modoSalvar = 'Post';
    this.openModal(template);
  }

  excluirEvento(evento: Evento, template: any){
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o evento: ${evento.tema} , Código: ${evento.id} ?`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com sucesso');
        }, error => {
          this.toastr.error('Erro ao tentar deletar.')
          console.log(error);
        }
    );
  }
  
  uploadImagem(){
    if(this.modoSalvar == 'Post'){
      const nomeArquivo = this.evento.imagemUrl.split('\\', 3);
      this.evento.imagemUrl = nomeArquivo[2];
      
      this.eventoService.postUpload(this.file, nomeArquivo[2])
      .subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos()
        }
      );
    }else {
      this.evento.imagemUrl = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
      .subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos()
        }
      );
    }
    
  }

  SalvarAlteracao(template: any){
    if(this.eventoForm.valid){
      if(this.modoSalvar == 'Post'){
        this.evento = Object.assign({}, this.eventoForm.value);
        
        this.uploadImagem();

        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
            this.toastr.success('Salvo com sucesso');
          }, error => {
            this.toastr.error(`Erro ao Salvar: ${error}`);
            console.log(error);
          }
        );
      }else {
        this.evento = Object.assign({id: this.evento.id}, this.eventoForm.value);
        
        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com sucesso');
          }, error => {
            this.toastr.error(`Erro ao alterar: ${error}`);
            console.log(error);
          }
        );
      }
      
    }
  }

  public validation() {
    this.eventoForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemUrl: ['', Validators.required],
      telefone:['', Validators.required],
      email:['', [Validators.required, Validators.email]]
    });
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
     (evento: any) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  getEventos(){
    console.log("metodo eventos");
    this.eventoService.getAllEvento().subscribe((_eventos: Evento[]) => {
      console.log("Retornou evento") 
      this.eventos = _eventos;
      this.eventosFiltrados = this.eventos;
       console.log(_eventos);
     }, error => { 
        this.toastr.error(`Erro ao consultar eventos: ${error}`);
      });
  }

  getEventoById(id: number){
    this.eventoService.getEventoById(id).subscribe((_evento: Evento)=>{
      this.evento = _evento;
    }, error => {
      console.log("Erro ao consultar o evento");
    });
  }

  onFileChange(event){
    const reader = new FileReader();
    if(event.target.files && event.target.files.length){
      this.file = event.target.files; 
    }
  }
}
