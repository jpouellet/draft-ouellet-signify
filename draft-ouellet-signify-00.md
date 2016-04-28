-- Internet Engineering Task Force
This is the "working group" field, used to specify who (usually an IETF committee) is in charge of the standard.

For submissions from individuals who are not a part of the IETF or any working group, the text "Internet Engineering Task Force" is recommended.

Historically, most of the original standards came from the "Network Working Group".

The function of working groups is described in RFC 2418 ("IETF Working Group Guidelines and Procedures").

-- J-P\. Ouellet
Initials for my first name are tricky. RFC 7322 ("RFC Style Guide") section 3.6 specifies abbreviation rules, but not for peoples' names. I initially thought it would be "**`J.-P.`** `Ouellet`" , but there is a [famous cryptographer](https://131002.net/) by the name of Jean-Philippe Aumasson who, while authoring RFC 7693, abbreviated his name as "**`J-P.`** `Aumasson`", so I'm following his precedent.

This may be one of the things that defaults to the Chicago Manual of Style.

-- Internet-Draft
All proposed working memos are known as "Internet Drafts" or I-Ds until such a time as they are approved by the RFC Editor and become RFCs.

-- Independent
RFC 7322 section 4.1.2 specifies:

> If an author cannot or will not provide an affiliation for any reason, "Independent", "Individual Contributor", "Retired", or some other term that appropriately describes the author's affiliation may be used.  Alternatively, a blank line may be included in the document header when no affiliation is provided.

-- Intended status: Standards Track
RFC 2026 ("The Internet Standards Process -- Revision 3") section 4 specifies the acceptable statues for standards track documents.

-- Expires.*20[0-9]{2}
Proposed Internet-Drafts expire after 6 months.

-- Signify( [^ ]+)*
Specified in RFC 7322 section 4.2.

The title must be centered and below the rest of the heading. If longer than 39 characters you are to also provide an abbreviated title.

If the document describes a protocol internal to a particular company, it should be prefixed with "*company-name*'s ...". I debated prefixing the title of this document with "OpenBSD's ...", but signify is more broadly applicable, and has already been ported to other systems.

-- draft-[-a-z]+-[0-9]{2}
This is the document name, and also the base of the filename. This is identifier by which the document is referred to before it is accepted by the RFC Editor and gets an RFC number. The format for these names is specified by [Guidelines to Authors of Internet-Drafts](https://www.ietf.org/id-info/guidelines.html).

-- Abstract
RFC 7322 requires an abstract for all documents, and says that it:

- should be complete and able to stand on its own
- is not a substitute for the introduction section
- should begin with something like "This memo ..." or "This document ..."

RFC 2223 (obsolete) says that even though each document shall have an abstract, sometimes it may be called something else. Proposed alternative abstract section names are:

- Protocol
- Discussion
- Interest
- Status Report

-- Status of This Memo
This is a standard boilerplate section as specified by RFC 5741 ("RFC Streams, Headers, and Boilerplates").

-- 78
"Rights Contributors Provide to the IETF Trust"

see note about `Copyright Notice` section below

-- 79
"Intellectual Property Rights in IETF Technology"

see note about `Copyright Notice` section below

-- Copyright Notice
RFC 5378 ("Rights Contributors Provide to the IETF Trust") details all the intellectual property considerations of this section.

Over the years there have been several different recommendations of what to do. Originally RFC 3667 and RFC 3978 (both "IETF Rights in Contributions") said to grant rights to "the IETF (meaning the full set of participants in the IETF Standards Process)", but then the "IETF Trust" (a legal entity) was established, and RFC 4748 was issued to update these previous recommendations and tell people to grant rights to the IETF Trust instead.

-- ^1.1.  Requirements Language
This section is described in RFC 7322 section 4.8.2.

If such keywords are used, RFC 7322 specifies that RFC 2119 ("Key words for use in RFCs to Indicate Requirement Levels") must be the document cited, and is therefore one of the most-cited and most well-known RFCs ever.

There is also RFC 6919 ("Further Key Words for Use in RFCs to Indicate Requirement Levels") which specifies the following additional key words:

- MUST (BUT WE KNOW YOU WON'T)
- SHOULD CONSIDER
- REALLY SHOULD NOT
- OUGHT TO
- WOULD PROBABLY
- MAY WISH TO
- COULD
- POSSIBLE
- MIGHT

which are much closer to how people actually treat the RFC 2119 keywords.

Unfortunately RFC 6919 is in the "Experimental" category (not a standards-track document), and standards-track documents are not allowed to incorporate (through dependency of normative content) on documents of lesser statuses.

-- IANA Considerations
Required by RFC 5226

-- Blacksburg.*24060
It is suggested that you put a proper full mailing address, but I don't know what the scope of distribution of this document would be, and I'd prefer not to advertise my address everywhere.

Same goes for the recommendation of a phone number.

