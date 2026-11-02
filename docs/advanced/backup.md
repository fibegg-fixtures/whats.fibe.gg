---
title: Data Backup
description: Export selected Personal or Team resources, import an archive, and back up the complete self-hosted installation.
slug: /advanced/backup
sidebar_position: 11
keywords: [backup, restore, data transfer, SQLite, installation]
---

**Profile → Advanced Settings → Data Backup** offers owner-scoped export and import. Select the Personal or Team owner first. This transfers supported Fibe resource records; it is not a backup of the SQLite installation or the files and volumes on Hosts.

## Export selected resources

1. Open **Profile → Advanced Settings → Data Backup → Export**.
2. Choose the resource families to include: ENV packs, Repositories, Hosts, Specs, Agents, Playgrounds, Templates, Secrets, and webhook endpoints.
3. Start the export. Fibe runs it as an asynchronous background transfer; follow its status in **History**.
4. Download the archive from the completed transfer while it is retained. The default export retention is 24 hours and can be changed by installation configuration.

The archive is a bounded JSONL transfer format. Secret Vault values are never exported; Secret entries carry metadata only. The export does not include user profile/session data, API keys, Audit Logs, host container data, or external provider contents. A selected resource record may refer to external state that this archive does not contain.

## Import an archive

1. Open **Profile → Advanced Settings → Data Backup → Import** and select the resource families to import.
2. Choose an archive file and conflict strategy: **merge** updates matching records where supported; **skip** leaves matching destination records unchanged.
3. Start the import and follow progress in **History**. The default upload limit is 50 MB and the default record limit is 5,000; installation policy may change these limits.
4. Review warnings and imported resources. A completed import can be rolled back from History when the transfer reports that it is rollbackable.

Imported Secret metadata has no secret value. Add a usable value in **Secret Vault** before a workload that depends on it runs. Team and Personal resources remain tied to the selected owner context; importing an archive does not transfer authority from the source owner.

## Back up the whole installation

For an upgrade, disaster recovery, or a full migration, back up the complete stopped Fibe data directory with the operator command documented in the [deployment guide](https://github.com/fibegg/fibe-api/tree/main/deploy):

From the Compose deployment directory, stop Fibe and run the operator backup against the stopped data volume. The host backup directory must be writable by the container's Fibe user:

```sh
docker compose stop fibe
docker compose ps fibe  # confirm it has exited
docker compose run --rm --no-deps -v /srv/fibe-backups:/backup fibe \
  operator backup --output /backup
docker compose start fibe
```

The command writes an archive and a `.tar.manifest.json` sidecar. Keep both securely: the archive contains the installation encryption key. Verify the archive with `fibe-api operator verify-backup --archive <archive>`. The archive contains the database and remaining WAL, installation identity, key material, SSH state, persistent files, and a manifest of referenced blobs. For S3-compatible storage, object bytes are included by default only up to the configured size limit; otherwise snapshot the bucket at the same stopped moment or explicitly include the objects. See the [deployment guide](https://github.com/fibegg/fibe-api/tree/main/deploy) for backup options and verification.

If a rollback is needed, restore the full archive before starting the older image; changing the image alone does not reverse a migrated SQLite schema.

Host workload volumes, containers, Git repositories, registry contents, and external object stores live outside the Fibe data directory. Back those systems up separately. Restore while Fibe is stopped, using `docker compose run --rm --no-deps -v /srv/fibe-backups:/backup fibe operator restore --archive /backup/<name>.tar --replace-existing`, then start it and complete the required restore review. The deployment guide documents post-restore reconciliation requirements.

## Related

- [Self-hosted operation](/concepts/billing/): installation and upgrade responsibilities.
- [Hosts](/concepts/hosts/): workload machines and their data.
- [Secret Vault & Job ENV](/advanced/secrets/): recreate secret values omitted from account exports.
