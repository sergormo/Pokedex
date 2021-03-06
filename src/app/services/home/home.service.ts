import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ApiService } from '../api/api.service';
import { Pokemon } from '../../models/pokemon';
import { NgForage } from 'ngforage';

@Injectable()
export class HomeService {
    public pokemons: Pokemon[];

    public pokeArray: any;

    public loaded: number;
    public total: number;

    constructor(
        private api: ApiService,
        private forage: NgForage
    ) {
        this.pokemons = [];
    }

    setData(): any {

        let promise = new Promise((resolve, reject) => {
            this.api.get('', { responseType: 'text' })
                .subscribe((res: InitData) => {

                    // build array from counter

                    let totalCount = res.count;
                    this.total = totalCount;
                    let i;
                    this.pokeArray = [];
                    for (i = 1; i < totalCount; i++) {
                        this.pokeArray.push(i);
                    }

                    this.pokeArray.reduce((promiseChain, item) => {
                            return promiseChain.then(() => new Promise((resolve) => {
                                this.storePokemons(item, resolve);
                            }));
                        }, Promise.resolve())
                        .then(() => {
                            resolve(this.pokemons);
                            console.log('done');
                        });
                });
        });

        return promise;
    }

    storePokemons(item: any, callback) {
        // check if it is in local stored
        this.forage.getItem(item)
            .then((data: Pokemon) => {
                if (data && data.id === item) {
                    callback();
                }
                else {
                    this.api.get(item)
                        .subscribe((pokemonData: Pokemon) => {
                            this.loaded = item;
                            let itemStr = item.toString();
                            this.forage.setItem(itemStr, pokemonData);
                            this.pokemons.push(pokemonData);
                            callback();
                        });
                }
            });

    }

    checkLocal(): Promise < any > {
        let promise = new Promise((resolve, reject) => {

            let pokemonsArray = [];

            let delay = () => {
                this.orderArray(pokemonsArray);
                this.pokemons = pokemonsArray;
                resolve(pokemonsArray);
            }

            this.forage.iterate(function(value, key, iterationNumber) {
                pokemonsArray.push(value);
            }).then(() => {
                console.log('Local Data - Iteration has completed');
                delay();
                return;
            }).catch((err) => {
                // This code runs if there were any errors
                console.log(err);
            });
        });

        return promise;
    }

    orderArray(array: any): void {
        console.log('Ordering Array');
        array.sort((a, b) => {
            if (a.id > b.id) {
                return 1;
            }
            if (a.id < b.id) {
                return -1;
            }
            return 0;
        })
    }

    // GETTING A STREAM OF ACTIONS

    // getPokemons(): Observable<Pokemon[]> {
    //     return new Observable((observer) => {

    //         this.checkLocal()
    //             .then((data) => {
    //                 console.log('paso 1');
    //                 console.log(data);
    //                 observer.next(data);
    //             });

    //         // observable execution
    //         observer.complete()
    //     })
    // }
}
