import { eleves, groupes } from "./data.js";

const compteur = document.getElementById("compteur");
const listEleves = document.getElementById("liste-eleves");
const filtreGroupe = document.getElementById("filtre-groupe");
const recherche = document.getElementById("recherche");
const aucunResultat = document.getElementById("aucun-resultat");
const tri = document.getElementById("tri");
const bilanMeilleur = document.getElementById("bilan-meilleur");
const bilanMoyenne = document.getElementById("bilan-moyenne");
const bilanAbsences = document.getElementById("bilan-absences");
const bilanAlertes = document.getElementById("bilan-alertes");
const listeParents = document.getElementById("liste-parents");
const aucuneAlerte = document.getElementById("aucune-alerte");

groupes.forEach(function (groupe) {
  const option = document.createElement("option");
  option.value = groupe.id;
  option.textContent = groupe.nom;
  filtreGroupe.append(option);
});

function calculerMoyenne(eleve) {
  if (eleve.notes.length === 0) return 0;

  const total = eleve.notes.reduce(function (somme, note) {
    return somme + note;
  }, 0);

  return total / eleve.notes.length;
}

function afficherBilan() {
  const groupeSelectionne = filtreGroupe.value;

  const elevesGroupe = eleves.filter(function (eleve) {
    return (
      groupeSelectionne === "" || String(eleve.groupeId) === groupeSelectionne
    );
  });

  const elevesAvecNotes = elevesGroupe.filter(function (eleve) {
    return eleve.notes.length > 0;
  });

  const totalMoyennes = elevesAvecNotes.reduce(function (total, eleve) {
    return total + calculerMoyenne(eleve);
  }, 0);

  const moyenneGroupe =
    elevesAvecNotes.length > 0 ? totalMoyennes / elevesAvecNotes.length : 0;

  const elevesAvecNotesTries = elevesAvecNotes.slice().sort(function (a, b) {
    return calculerMoyenne(b) - calculerMoyenne(a);
  });

  const meilleurEleve = elevesAvecNotesTries[0];

  if (meilleurEleve) {
    bilanMeilleur.textContent = `${meilleurEleve.prenom} ${meilleurEleve.nom} — ${calculerMoyenne(meilleurEleve).toFixed(1).replace(".", ",")} / 20`;
  } else {
    bilanMeilleur.textContent = "Aucune note disponible";
  }

  const totalAbsences = elevesGroupe.reduce(function (total, eleve) {
    return total + eleve.absences;
  }, 0);

  const elevesEnAlerte = elevesGroupe.filter(function (eleve) {
    return eleve.absences >= 3;
  });

  const parents = elevesEnAlerte.map(function (eleve) {
    const parent = document.createElement("li");

    parent.classList.add(
      "rounded-xl",
      "bg-card",
      "px-3",
      "py-2",
      "ring-1",
      "ring-line",
    );

    parent.textContent = `${eleve.prenom} ${eleve.nom} — ${eleve.telephoneParent}`;

    return parent;
  });

  const aucuneAlerteGroupe =
    elevesGroupe.length > 0 &&
    elevesGroupe.every(function (eleve) {
      return eleve.absences < 3;
    });

  bilanMoyenne.textContent = `${moyenneGroupe.toFixed(1).replace(".", ",")} / 20`;

  bilanAbsences.textContent = totalAbsences;

  bilanAlertes.textContent = elevesEnAlerte.length;

  listeParents.replaceChildren(...parents);

  aucuneAlerte.hidden = !aucuneAlerteGroupe;
}

function creerLigne(eleve) {
  const ligne = document.createElement("li");
  const contenu = document.createElement("div");
  const boutonFiche = document.createElement("button");
  const avatar = document.createElement("span");
  const informations = document.createElement("span");
  const nom = document.createElement("span");
  const details = document.createElement("span");
  const moyenne = document.createElement("span");
  const actions = document.createElement("div");
  const boutonAbsent = document.createElement("button");
  const labelNote = document.createElement("label");
  const inputNote = document.createElement("input");
  const boutonNote = document.createElement("button");
  const message = document.createElement("p");

  ligne.dataset.id = eleve.id;

  ligne.classList.add("rounded-2xl", "border", "border-line", "bg-card", "p-3");
  contenu.classList.add(
    "flex",
    "flex-col",
    "gap-3",
    "lg:flex-row",
    "lg:items-center",
  );

  boutonFiche.type = "button";
  boutonFiche.classList.add(
    "btn-fiche",
    "flex",
    "min-h-11",
    "flex-1",
    "items-center",
    "gap-3",
    "text-left",
  );

  avatar.classList.add(
    "grid",
    "size-10",
    "shrink-0",
    "place-items-center",
    "rounded-full",
    "bg-brand-soft",
    "text-sm",
    "font-semibold",
    "text-brand",
  );

  informations.classList.add("min-w-0", "flex-1");
  nom.classList.add("block", "truncate", "font-medium");
  details.classList.add("block", "text-sm", "text-muted");
  moyenne.classList.add("font-serif", "text-xl");
  actions.classList.add("flex", "gap-2");

  boutonAbsent.type = "button";
  boutonAbsent.textContent = "Absent";
  boutonAbsent.classList.add(
    "btn-absent",
    "h-11",
    "rounded-full",
    "border",
    "border-line",
    "px-3",
    "sm:px-4",
    "text-sm",
    "font-medium",
    "hover:bg-paper",
  );

  labelNote.classList.add("flex-1");

  inputNote.type = "number";
  inputNote.min = "0";
  inputNote.max = "20";
  inputNote.step = "0.5";
  inputNote.placeholder = "Note";
  inputNote.classList.add(
    "h-11",
    "w-full",
    "rounded-full",
    "border",
    "border-line",
    "bg-paper",
    "px-4",
    "text-sm",
    "lg:w-24",
  );

  boutonNote.type = "button";
  boutonNote.textContent = "Ajouter la note";
  boutonNote.classList.add(
    "btn-note",
    "h-11",
    "rounded-full",
    "bg-ink",
    "px-3",
    "sm:px-4",
    "text-sm",
    "font-medium",
    "text-white",
    "hover:bg-brand",
  );

  message.classList.add("message", "mt-2", "text-xs", "text-alert");
  message.textContent = "La note doit être un nombre entre 0 et 20.";
  message.hidden = true;

  avatar.textContent = (
    eleve.prenom.charAt(0) + eleve.nom.charAt(0)
  ).toUpperCase();

  nom.textContent = `${eleve.prenom} ${eleve.nom}`;
  details.textContent = `${eleve.absences} absence(s)`;

  moyenne.textContent =
    eleve.notes.length > 0
      ? `${calculerMoyenne(eleve).toFixed(1).replace(".", ",")} / 20`
      : "—";

  if (eleve.absences >= 3) {
    ligne.classList.add("alerte");
    avatar.classList.replace("bg-brand-soft", "bg-alert");
    avatar.classList.replace("text-brand", "text-white");

    const badge = document.createElement("span");
    badge.classList.add(
      "badge",
      "ml-1",
      "whitespace-nowrap",
      "rounded-full",
      "bg-alert",
      "px-2",
      "py-0.5",
      "text-xs",
      "font-medium",
      "text-white",
    );

    badge.textContent = "Prévenir les parents";

    details.append(badge);
  }

  informations.append(nom, details);
  boutonFiche.append(avatar, informations, moyenne);
  labelNote.append(inputNote);
  actions.append(boutonAbsent, labelNote, boutonNote);
  contenu.append(boutonFiche, actions);
  ligne.append(contenu, message);

  return ligne;
}

function afficherEleves() {
  const groupeSelectionne = filtreGroupe.value;
  const texteRecherche = recherche.value.toLowerCase().trim();

  const eleveGroupe = eleves.filter(function (e) {
    const correspondGroupe =
      groupeSelectionne === "" || String(e.groupeId) === groupeSelectionne;

    return correspondGroupe;
  });

  const elevesFiltres = eleves.filter(function (eleve) {
    const correspondGroupe =
      groupeSelectionne === "" || String(eleve.groupeId) === groupeSelectionne;

    const nomComplet = `${eleve.prenom} ${eleve.nom}`.toLowerCase();
    const correspondRecherche = nomComplet.includes(texteRecherche);

    return correspondGroupe && correspondRecherche;
  });

  if (tri.value === "nom") {
    elevesFiltres.sort(function (a, b) {
      return `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`);
    });
  } else if (tri.value === "moyenne") {
    elevesFiltres.sort(function (a, b) {
      return calculerMoyenne(b) - calculerMoyenne(a);
    });
  }

  const lignes = elevesFiltres.map(creerLigne);

  listEleves.replaceChildren(...lignes);

  compteur.textContent = `${elevesFiltres.length} / ${eleveGroupe.length} élèves`;
  aucunResultat.hidden = elevesFiltres.length !== 0;
}

listEleves.addEventListener("click", function (event) {
  const boutonAbsent = event.target.closest(".btn-absent");

  const boutonNote = event.target.closest(".btn-note");

  if (!boutonAbsent && !boutonNote) return;

  const ligne = event.target.closest("li");

  const id = ligne.dataset.id;

  const eleve = eleves.find(function (e) {
    return String(e.id) === id;
  });

  if (!eleve) return;

  if (boutonAbsent) {
    eleve.absences++;
  }

  if (boutonNote) {
    const inputNote = ligne.querySelector("input");
    const message = ligne.querySelector(".message");

    const valeur = inputNote.value.trim();
    const note = Number(valeur);

    if (valeur === "" || !Number.isFinite(note) || note < 0 || note > 20) {
      message.hidden = false;
      return;
    }

    eleve.notes.push(note);

    inputNote.value = "";
    message.hidden = true;
  }

  if (tri.value === "moyenne") {
    afficherEleves();
  } else {
    const nouvelleLigne = creerLigne(eleve);
    ligne.replaceWith(nouvelleLigne);
  }

  afficherBilan();
});

filtreGroupe.addEventListener("change", afficherEleves);
filtreGroupe.addEventListener("change", afficherBilan);
recherche.addEventListener("input", afficherEleves);
tri.addEventListener("change", afficherEleves);

afficherEleves();
afficherBilan();

const formEleve = document.getElementById("form-eleve");

const prenom = document.getElementById("prenom");
const nom = document.getElementById("nom");
const groupe = document.getElementById("groupe");
const email = document.getElementById("email");
const telephone = document.getElementById("telephone");
const code = document.getElementById("code");

const formSucces = document.getElementById("form-succes");
const formErreur = document.getElementById("form-erreur");

groupes.forEach(function (groupeItem) {
  const option = document.createElement("option");

  option.value = groupeItem.id;
  option.textContent = groupeItem.nom;

  groupe.append(option);
});

const regexNom = /^[A-Za-zÀ-ÿ\s-]{2,}$/;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelephone = /^(0[67]\d{8}|\+212[67]\d{8})$/;
const regexCode = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function verifierChamp(champ) {
  const valeur = champ.value.trim();
  const message = document.getElementById(champ.id + "-msg");
  const bloc = champ.closest(".champ");

  let valide = false;
  let texte = "";

  if (champ === prenom || champ === nom) {
    valide = regexNom.test(valeur);
    texte = "2 caractères minimum : lettres, espaces ou tirets.";
  }

  if (champ === email) {
    valide = regexEmail.test(valeur);
    texte = "Adresse email invalide.";
  }

  if (champ === telephone) {
    valide = regexTelephone.test(valeur);
    texte = "Numéro marocain invalide.";
  }

  if (champ === code) {
    valide = regexCode.test(valeur);
    texte =
      "8 caractères minimum, une majuscule, un chiffre et un caractère spécial.";
  }

  if (champ === groupe) {
    valide = valeur !== "";
    texte = "Veuillez choisir un groupe.";
  }

  if (valide) {
    bloc.classList.remove("erreur");
    bloc.classList.add("valide");
    message.textContent = "Champ valide.";
  } else {
    bloc.classList.remove("valide");
    bloc.classList.add("erreur");
    message.textContent = texte;
  }

  return valide;
}

const champs = [prenom, nom, groupe, email, telephone, code];

champs.forEach(function (champ) {
  const evenement = champ === groupe ? "change" : "input";

  champ.addEventListener(evenement, function () {
    verifierChamp(champ);
    formErreur.hidden = true;
  });
});

formEleve.addEventListener("submit", function (event) {
  event.preventDefault();

  formSucces.hidden = true;
  formErreur.hidden = true;

  const validations = champs.map(function (champ) {
    return verifierChamp(champ);
  });

  const formulaireValide = validations.every(function (valide) {
    return valide;
  });

  if (!formulaireValide) {
    const index = validations.indexOf(false);
    champs[index].focus();
    return;
  }

  const doublon = eleves.some(function (eleve) {
    return (
      eleve.prenom.toLowerCase() === prenom.value.trim().toLowerCase() &&
      eleve.nom.toLowerCase() === nom.value.trim().toLowerCase() &&
      eleve.groupeId === Number(groupe.value)
    );
  });

  if (doublon) {
    formErreur.textContent = "Cet élève existe déjà dans ce groupe.";
    formErreur.hidden = false;
    prenom.focus();
    return;
  }

  const nombreEleves = eleves.filter(function (eleve) {
    return eleve.groupeId === Number(groupe.value);
  }).length;

  if (nombreEleves >= 15) {
    formErreur.textContent = "Ce groupe est complet (15 élèves).";
    formErreur.hidden = false;
    groupe.focus();
    return;
  }

  const nouvelEleve = {
    id:
      Math.max(
        ...eleves.map(function (eleve) {
          return eleve.id;
        }),
      ) + 1,

    prenom: prenom.value.trim(),
    nom: nom.value.trim(),
    groupeId: Number(groupe.value),
    emailParent: email.value.trim(),
    telephoneParent: telephone.value.trim(),
    absences: 0,
    notes: [],
  };

  eleves.push(nouvelEleve);

  afficherEleves();
  afficherBilan();

  formEleve.reset();

  champs.forEach(function (champ) {
    champ.closest(".champ").classList.remove("valide", "erreur");
  });

  formSucces.hidden = false;
});
