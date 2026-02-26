<?php
namespace App\Controller;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
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
}