import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService} from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventoForm = new FormGroup({
    tema: new FormControl(),
    local: new FormControl(),
    dataEvento: new FormControl(),
    qtdPessoa: new FormControl(),
    imagemURL: new FormControl(),
    telefone: new FormControl(),
    email: new FormControl(),
  });

  eventosFiltrados!: Evento[];
  eventos!: Evento[];
  evento!: Evento;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  
  constructor(
    private eventoService: EventoService
  , private modalService: BsModalService
  , private fb: FormBuilder
  , private localService: BsLocaleService) {
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
    template.show(template);
  }  

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  salvarAlteracao(){
  }

  public validation() {
    this.eventoForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoa: ['', [Validators.required, Validators.max(120000)]],
      imagemURL: ['', Validators.required],
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
       console.log("erro ao consultar eventos");
      });
  }
}
