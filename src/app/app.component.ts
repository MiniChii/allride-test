import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { GeocodingService } from './service/geocoding/geocoding.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { WsClientService } from './service/wsClient/ws-client.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    GoogleMapsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    ListboxModule,
    CommonModule,
    InputGroupModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'allride-test';
  addresSelected = {
    name: '',
  };
  suggestions: any[] = [];
  address: string = '';

  markers: google.maps.LatLngLiteral[] = [];

  options: google.maps.MapOptions = {
    mapId: 'DEMO_MAP_ID',
    center: { lat: -33.44, lng: -70.66 },
    zoom: 10,
  };

  @ViewChild(GoogleMap) map!: GoogleMap;

  constructor(
    private geocodingService: GeocodingService,
    private clientWs: WsClientService
  ) {
    this.clientWs.getCoordenates().subscribe((data) => {
      console.log('getCoordenates', data);
      this.markers.push(data);
    });
  }

  findAddressLocation() {
    const address = this.address;
    if (address && address.length > 4) {
      this.geocodingService.getGeocoding(address).subscribe({
        next: (response: any) => {
          this.suggestions = response.results.map((a: any) => {
            return { name: a.formatted_address, location: a.geometry.location };
          });
        },
      });
    }
  }

  addPin(coordenates: google.maps.LatLngLiteral) {
    this.markers.push(coordenates);
    this.suggestions = [];
    this.address = '';
    this.centerMap();
  }
  centerMap() {
    if (this.markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((marker) => bounds.extend(marker));
      this.map.fitBounds(bounds);
    }
  }

  onClickList(event: any) {
    const coordenates: google.maps.LatLngLiteral = event.option.location;
    this.addPin(coordenates);
    this.sendCoordenates(coordenates);
  }

  sendCoordenates(coordenates: google.maps.LatLngLiteral) {
    this.clientWs.sendCoordenates(coordenates);
  }
}
