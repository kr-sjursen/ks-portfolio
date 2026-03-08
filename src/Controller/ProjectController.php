<?php
namespace App\Controller;

use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;

use PokePHP\PokeApi;

class ProjectController extends AbstractController
{
    #[Route('/lore-tracker', name: 'lore tracker')]
    public function loreTracker(): Response
    {
        return $this->render('main/projects/lore_tracker.html.twig');
    }

    #[Route('/notes-app', name: 'notes app')]
    public function notesApp(): Response
    {
        return $this->render('main/projects/notes_app.html.twig');
    }

    #[Route('/pokedex', name: 'pokedex')]
    public function pokedex(): Response
    {
        // TODO: Check for pokemon ID in url, and change displayPokemon to reflect that.

        $pokeApi = new PokeApi();
        $displayPokemon = json_decode($pokeApi->pokemon(1)); // Example: Get Pokémon with ID 1

        // Grab the first 25 pokemon to an array
        // TODO: Grab the rest of the 1025 pokemon...
        $list = [];
        for ($i = 1; $i <= 25; $i++) {
            $apiResponse = $pokeApi->pokemon($i);
            $pokemon = json_decode($apiResponse);
            $list[] = $pokemon;
        }

        return $this->render('main/projects/pokedex.html.twig', [
            'displayPokemon' => $displayPokemon,
            'pokemonList' => $list
        ]);
    }
}