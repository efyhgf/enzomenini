<?php
/**
 * send.php — Gestionnaire d'envoi du formulaire de contact
 * À placer à la racine de ton portfolio sur un serveur PHP.
 * Appelle ce fichier depuis script.js (voir les commentaires dans script.js).
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// ── Configuration ──────────────────────────────────────────────
$destinataire = 'votre@email.com';   // ← Ton adresse email
$sujet_prefix = '[Portfolio] ';
// ───────────────────────────────────────────────────────────────

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// Récupération et nettoyage des champs
function clean(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)));
}

$nom     = clean($_POST['name']    ?? '');
$email   = clean($_POST['email']   ?? '');
$sujet   = clean($_POST['subject'] ?? 'Message depuis le portfolio');
$message = clean($_POST['message'] ?? '');

// Validation basique
if (empty($nom) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'Champs obligatoires manquants.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Adresse email invalide.']);
    exit;
}

// Construction du mail
$corps = <<<MAIL
Nouveau message reçu depuis ton portfolio.

Nom     : {$nom}
Email   : {$email}
Sujet   : {$sujet}

Message :
{$message}

---
Envoyé automatiquement depuis le formulaire de contact.
MAIL;

$entetes  = "From: {$nom} <{$email}>\r\n";
$entetes .= "Reply-To: {$email}\r\n";
$entetes .= "Content-Type: text/plain; charset=UTF-8\r\n";

$envoye = mail($destinataire, $sujet_prefix . $sujet, $corps, $entetes);

if ($envoye) {
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'envoi. Réessaie plus tard.']);
}
